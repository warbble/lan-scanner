import { exec } from 'child_process';
import { promisify } from 'util';
import { createLimiter } from './concurrency';

const execAsync = promisify(exec);

export interface OpenPort {
  port: number;
  protocol: 'tcp' | 'udp';
  service?: string;
  state: 'open' | 'closed' | 'filtered';
}

// Common ports to scan for quick discovery
const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 139, service: 'NetBIOS' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 993, service: 'IMAPS' },
  { port: 995, service: 'POP3S' },
  { port: 1433, service: 'SQL Server' },
  { port: 3306, service: 'MySQL' },
  { port: 3389, service: 'RDP' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 5900, service: 'VNC' },
  { port: 8080, service: 'HTTP Alt' },
  { port: 8443, service: 'HTTPS Alt' }
];

export async function scanPorts(ip: string, ports?: number[]): Promise<OpenPort[]> {
  const portsToScan = ports || COMMON_PORTS.map(p => p.port);
  const openPorts: OpenPort[] = [];
  
  // Use nmap if available for faster scanning
  try {
    const { stdout } = await execAsync(`which nmap`, { timeout: 1000 });
    if (stdout.trim()) {
      return await scanWithNmap(ip, portsToScan);
    }
  } catch {
    // nmap not available, fall back to manual scanning
  }
  
  // Manual port scanning using nc (netcat)
  const limit = createLimiter(20); // Limit concurrent port scans
  const scanTasks = portsToScan.map(port =>
    limit(async () => {
      const result = await checkPort(ip, port);
      if (result) {
        openPorts.push(result);
      }
      return result;
    })
  );
  
  await Promise.allSettled(scanTasks);
  return openPorts.sort((a, b) => a.port - b.port);
}

async function scanWithNmap(ip: string, ports: number[]): Promise<OpenPort[]> {
  try {
    const portList = ports.join(',');
    const { stdout } = await execAsync(
      `nmap -p ${portList} --open -T4 ${ip}`,
      { timeout: 30000 }
    );
    
    return parseNmapOutput(stdout);
  } catch {
    // Fall back to manual scanning if nmap fails
    return [];
  }
}

function parseNmapOutput(output: string): OpenPort[] {
  const ports: OpenPort[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\d+)\/(tcp|udp)\s+(open|closed|filtered)\s*(.+)?$/);
    if (match) {
      const [, portNum, protocol, state, service] = match;
      ports.push({
        port: parseInt(portNum),
        protocol: protocol as 'tcp' | 'udp',
        state: state as 'open' | 'closed' | 'filtered',
        service: service?.trim() || getServiceName(parseInt(portNum))
      });
    }
  }
  
  return ports;
}

async function checkPort(ip: string, port: number): Promise<OpenPort | null> {
  try {
    // Try to connect using nc (netcat)
    await execAsync(`nc -z -w1 ${ip} ${port}`, { timeout: 2000 });
    
    return {
      port,
      protocol: 'tcp',
      state: 'open',
      service: getServiceName(port)
    };
  } catch {
    return null; // Port is closed or filtered
  }
}

function getServiceName(port: number): string {
  const commonPort = COMMON_PORTS.find(p => p.port === port);
  return commonPort?.service || 'Unknown';
}

export function formatPorts(ports: OpenPort[]): string {
  if (!ports || ports.length === 0) return '-';
  
  return ports
    .map(p => `${p.port}/${p.protocol}${p.service ? ` (${p.service})` : ''}`)
    .join(', ');
}