import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function resolveHostname(ip: string): Promise<string | null> {
  try {
    // Try multiple approaches in parallel for faster resolution
    const resolvers = [
      // Method 1: dig reverse lookup
      (async () => {
        try {
          const { stdout } = await execAsync(`dig -x ${ip} +short +time=1`, { timeout: 1500 });
          const hostname = stdout.trim();
          if (hostname && !hostname.includes('NXDOMAIN') && hostname !== '' && !hostname.includes('SERVFAIL')) {
            return hostname.replace(/\.$/, ''); // Remove trailing dot
          }
        } catch {}
        return null;
      })(),
      
      // Method 2: host command
      (async () => {
        try {
          const { stdout } = await execAsync(`host ${ip}`, { timeout: 1500 });
          const hostMatch = stdout.match(/domain name pointer (.+)\./);
          if (hostMatch) {
            return hostMatch[1].trim();
          }
        } catch {}
        return null;
      })(),
      
      // Method 3: nslookup
      (async () => {
        try {
          const { stdout } = await execAsync(`nslookup ${ip}`, { timeout: 1500 });
          const nameMatch = stdout.match(/name = (.+)\./);
          if (nameMatch) {
            return nameMatch[1].trim();
          }
        } catch {}
        return null;
      })()
    ];
    
    // Return the first successful result
    const results = await Promise.allSettled(resolvers);
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        return result.value;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}