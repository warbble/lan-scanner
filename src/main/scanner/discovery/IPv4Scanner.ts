import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import { createLimiter } from '../../utils/concurrency';
import IPCIDR from 'ip-cidr';
import { Device } from '../../../shared/types';

const execAsync = promisify(exec);

export interface IPv4ScannerOptions {
  timeout?: number;
  concurrency?: number;
}

export class IPv4Scanner {
  private timeout: number;
  private concurrency: number;

  constructor(options: IPv4ScannerOptions = {}) {
    this.timeout = options.timeout || 1000;
    this.concurrency = options.concurrency || 32;
  }

  async scan(subnet?: string): Promise<Device[]> {
    const targetSubnet = subnet || this.detectSubnet();
    
    if (!targetSubnet) {
      throw new Error('Could not detect network subnet');
    }

    const ips = this.generateIPList(targetSubnet);
    const devices = await this.pingSweep(ips);
    const arpDevices = await this.getArpTableDevices(targetSubnet);
    
    return this.mergeDevices(devices, arpDevices);
  }

  private detectSubnet(): string | null {
    const interfaces = os.networkInterfaces();
    
    for (const [name, addrs] of Object.entries(interfaces)) {
      if (!name.startsWith('en')) continue;
      
      for (const addr of addrs || []) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return this.calculateSubnet(addr.address, addr.netmask);
        }
      }
    }
    
    return null;
  }

  private calculateSubnet(ip: string, netmask: string): string {
    const ipParts = ip.split('.').map(Number);
    const maskParts = netmask.split('.').map(Number);
    const networkParts = ipParts.map((part, i) => part & maskParts[i]);
    const networkAddr = networkParts.join('.');
    
    const maskBits = maskParts
      .map(part => part.toString(2).padStart(8, '0'))
      .join('')
      .split('1').length - 1;
    
    return `${networkAddr}/${maskBits}`;
  }

  private generateIPList(subnet: string): string[] {
    const cidr = new IPCIDR(subnet);
    const ips = cidr.toArray();
    return ips.length > 2 ? ips.slice(1, -1) : ips;
  }

  private async pingSweep(ips: string[]): Promise<Device[]> {
    const limit = createLimiter(this.concurrency);
    const devices: Device[] = [];
    
    const pingTasks = ips.map(ip =>
      limit(async () => {
        const device = await this.pingHost(ip);
        if (device) devices.push(device);
        return device;
      })
    );
    
    await Promise.allSettled(pingTasks);
    return devices;
  }

  private async pingHost(ip: string): Promise<Device | null> {
    try {
      const startTime = Date.now();
      await execAsync(
        `ping -c 1 -W ${this.timeout} ${ip}`,
        { timeout: this.timeout + 500 }
      );
      
      return {
        ip,
        ipVersion: 4,
        lastSeen: Date.now(),
        responseTime: Date.now() - startTime,
        isOnline: true
      } as Device;
      
    } catch {
      return null;
    }
  }

  private async getArpTableDevices(subnet: string): Promise<Device[]> {
    try {
      const { stdout } = await execAsync('arp -a');
      const devices: Device[] = [];
      const cidr = new IPCIDR(subnet);
      const arpRegex = /\(([0-9.]+)\)\s+at\s+([0-9a-f:]+)\s+on\s+(\S+)/gi;
      
      let match;
      while ((match = arpRegex.exec(stdout)) !== null) {
        const [_, ip, mac, iface] = match;
        
        if (cidr.contains(ip)) {
          devices.push({
            ip,
            ipVersion: 4,
            mac: this.normalizeMac(mac),
            lastSeen: Date.now(),
            isOnline: true // Devices in ARP table are typically online
          } as Device);
        }
      }
      
      return devices;
    } catch {
      return [];
    }
  }

  private normalizeMac(mac: string): string {
    return mac.toLowerCase().split(':').map(octet => octet.padStart(2, '0')).join(':');
  }

  private mergeDevices(pingDevices: Device[], arpDevices: Device[]): Device[] {
    const deviceMap = new Map<string, Device>();
    
    for (const device of pingDevices) {
      deviceMap.set(device.ip, device);
    }
    
    for (const arpDevice of arpDevices) {
      const existing = deviceMap.get(arpDevice.ip);
      if (existing) {
        if (!existing.mac && arpDevice.mac) {
          existing.mac = arpDevice.mac;
        }
      } else {
        deviceMap.set(arpDevice.ip, arpDevice);
      }
    }
    
    const devices = Array.from(deviceMap.values());
    devices.sort((a, b) => {
      const aParts = a.ip.split('.').map(Number);
      const bParts = b.ip.split('.').map(Number);
      
      for (let i = 0; i < 4; i++) {
        if (aParts[i] !== bParts[i]) {
          return aParts[i] - bParts[i];
        }
      }
      return 0;
    });
    
    return devices;
  }
}
