export interface OpenPort {
  port: number;
  protocol: 'tcp' | 'udp';
  service?: string;
  state: 'open' | 'closed' | 'filtered';
}

export interface Device {
  id?: string;
  ip: string;
  ipVersion: 4 | 6;
  mac?: string;
  hostname?: string;
  vendor?: string;
  deviceType?: string;
  ports?: OpenPort[];
  lastSeen: number;
  responseTime?: number;
  isOnline?: boolean;
  isNew?: boolean;
}

export interface ScanOptions {
  subnet?: string;
  ipv4?: boolean;
  ipv6?: boolean;
}

export interface ScanResult {
  devices: Device[];
  scanTime: number;
  errors: string[];
}

export interface SortConfig {
  field: 'ip' | 'mac' | 'hostname' | 'vendor' | 'lastSeen';
  direction: 'asc' | 'desc';
}

export interface DeviceFilter {
  searchTerm?: string;
  onlineOnly?: boolean;
  newOnly?: boolean;
}
