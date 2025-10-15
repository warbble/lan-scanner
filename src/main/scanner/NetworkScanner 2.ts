import { EventEmitter } from 'events';
import { createLimiter } from '../utils/concurrency';
import { resolveHostname } from '../utils/hostname';
import { detectDeviceType } from '../utils/deviceDetection';
import { Device, ScanOptions, ScanResult } from '../../shared/types';
import { IPv4Scanner } from './discovery/IPv4Scanner';
import { ArpingScanner } from './discovery/ArpingScanner';

export interface ScanConfig {
  pingTimeout?: number;
  arpTimeout?: number;
  concurrency?: number;
}

export class NetworkScanner extends EventEmitter {
  private ipv4Scanner: IPv4Scanner;
  private arpingScanner: ArpingScanner;
  private isScanning = false;

  constructor(private config: ScanConfig = {}) {
    super();
    
    this.ipv4Scanner = new IPv4Scanner({
      timeout: config.pingTimeout || 1000,
      concurrency: config.concurrency || 32
    });
    
    this.arpingScanner = new ArpingScanner({
      timeout: config.arpTimeout || 1000
    });
  }

  async scanNetwork(options: ScanOptions = {}): Promise<ScanResult> {
    if (this.isScanning) {
      throw new Error('Scan already in progress');
    }

    this.isScanning = true;
    const startTime = Date.now();
    const result: ScanResult = {
      devices: [],
      scanTime: 0,
      errors: []
    };

    try {
      this.emit('scan:start', { options });
      
      // Discover active hosts
      const activeHosts = await this.ipv4Scanner.scan(options.subnet);
      
      // Enrich with MAC addresses and hostnames
      const limit = createLimiter(10);
      const enrichmentTasks = activeHosts.map(device => 
        limit(async () => {
          try {
            // Get MAC address
            const mac = await this.arpingScanner.getMacAddress(device.ip);
            if (mac) device.mac = mac;
            
            // Resolve hostname
            const hostname = await resolveHostname(device.ip);
            if (hostname) device.hostname = hostname;
            
            return device;
          } catch (error) {
            return device;
          }
        })
      );
      
      result.devices = await Promise.all(enrichmentTasks);
      result.scanTime = Date.now() - startTime;
      
      this.emit('scan:complete', result);
      
    } catch (error: any) {
      result.errors.push(error.message);
      this.emit('scan:error', error);
      throw error;
    } finally {
      this.isScanning = false;
    }

    return result;
  }

  async stopScan(): Promise<void> {
    this.emit('scan:aborted');
  }
}
