import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

const execAsync = promisify(exec);

export interface ArpingScannerOptions {
  timeout?: number;
}

export class ArpingScanner {
  private timeout: number;

  constructor(options: ArpingScannerOptions = {}) {
    this.timeout = options.timeout || 1000;
  }

  async getMacAddress(ip: string): Promise<string | null> {
    const methods = [
      () => this.getViaArping(ip),
      () => this.getViaArpTable(ip)
    ];

    for (const method of methods) {
      try {
        const mac = await method();
        if (mac) return mac;
      } catch {
        continue;
      }
    }

    return null;
  }

  private async getViaArping(ip: string): Promise<string | null> {
    try {
      await execAsync('which arping');
      const iface = this.detectInterface(ip) || 'en0';
      const timeoutSec = Math.ceil(this.timeout / 1000);
      const { stdout } = await execAsync(
        `arping -c 2 -w ${timeoutSec} -I ${iface} ${ip}`,
        { timeout: this.timeout * 2 + 1000 }
      );

      const macRegex = /\[([0-9a-f:]{17})\]/i;
      const match = stdout.match(macRegex);
      if (match) return this.normalizeMac(match[1]);

    } catch {
      return null;
    }

    return null;
  }

  private async getViaArpTable(ip: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(`arp -a ${ip}`);
      const macRegex = /([0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2})/i;
      const match = stdout.match(macRegex);
      
      if (match) return this.normalizeMac(match[1]);
    } catch {
      return null;
    }

    return null;
  }

  private detectInterface(ip: string): string | null {
    const interfaces = os.networkInterfaces();
    
    for (const [name, addrs] of Object.entries(interfaces)) {
      for (const addr of addrs || []) {
        if (addr.internal) continue;
        if (this.isInSameSubnet(ip, addr.address, addr.netmask)) {
          return name;
        }
      }
    }

    return null;
  }

  private isInSameSubnet(ip1: string, ip2: string, netmask: string): boolean {
    if (!ip2 || !netmask) return false;
    if (!ip1.match(/^\d+\.\d+\.\d+\.\d+$/) || !ip2.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return false;
    }

    const ip1Parts = ip1.split('.').map(Number);
    const ip2Parts = ip2.split('.').map(Number);
    const maskParts = netmask.split('.').map(Number);

    for (let i = 0; i < 4; i++) {
      if ((ip1Parts[i] & maskParts[i]) !== (ip2Parts[i] & maskParts[i])) {
        return false;
      }
    }

    return true;
  }

  private normalizeMac(mac: string): string {
    return mac.toLowerCase().split(':').map(octet => octet.padStart(2, '0')).join(':');
  }
}
