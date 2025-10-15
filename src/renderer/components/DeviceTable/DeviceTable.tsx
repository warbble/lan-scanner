import React, { useState, useMemo } from 'react';
import { Device, SortConfig, DeviceFilter } from '../../../shared/types';
import { formatDistanceToNow } from 'date-fns';

function formatDeviceInfo(hostname?: string, vendor?: string, deviceType?: string): string {
  const parts = [];
  
  if (hostname) {
    parts.push(hostname);
  }
  
  if (vendor && deviceType) {
    parts.push(`${vendor} ${deviceType}`);
  } else if (vendor) {
    parts.push(vendor);
  } else if (deviceType) {
    parts.push(deviceType);
  }
  
  return parts.join(' • ') || '-';
}

function formatPorts(ports?: Array<{port: number; protocol: string; service?: string}>): string {
  if (!ports || ports.length === 0) return '-';
  
  return ports
    .map(p => `${p.port}/${p.protocol}${p.service ? ` (${p.service})` : ''}`)
    .join(', ');
}

interface DeviceTableProps {
  devices: Device[];
  isScanning?: boolean;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, isScanning }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'ip',
    direction: 'asc'
  });
  
  const [filter, setFilter] = useState<DeviceFilter>({
    searchTerm: '',
    onlineOnly: false
  });

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      if (filter.searchTerm) {
        const search = filter.searchTerm.toLowerCase();
        const matchesSearch = 
          device.ip.toLowerCase().includes(search) ||
          device.mac?.toLowerCase().includes(search) ||
          device.hostname?.toLowerCase().includes(search) ||
          device.vendor?.toLowerCase().includes(search) ||
          device.deviceType?.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }
      
      if (filter.onlineOnly && !device.isOnline) return false;
      
      return true;
    });
  }, [devices, filter]);

  const sortedDevices = useMemo(() => {
    const sorted = [...filteredDevices].sort((a, b) => {
      if (sortConfig.field === 'ip') {
        const aParts = a.ip.split('.').map(Number);
        const bParts = b.ip.split('.').map(Number);
        
        for (let i = 0; i < 4; i++) {
          if (aParts[i] !== bParts[i]) {
            return sortConfig.direction === 'asc' 
              ? aParts[i] - bParts[i] 
              : bParts[i] - aParts[i];
          }
        }
        return 0;
      }
      
      const aValue = a[sortConfig.field] || '';
      const bValue = b[sortConfig.field] || '';
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredDevices, sortConfig]);

  const handleSort = (field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className={`device-table ${isScanning ? 'scanning' : ''}`}>
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search devices..."
          value={filter.searchTerm}
          onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="search-input"
        />
        <label>
          <input
            type="checkbox"
            checked={filter.onlineOnly}
            onChange={(e) => setFilter(prev => ({ ...prev, onlineOnly: e.target.checked }))}
          />
          Show online only
        </label>
        {isScanning && <span style={{ color: '#667eea', fontWeight: '500' }}>🔄 Scanning...</span>}
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('ip')}>
              IP Address {sortConfig.field === 'ip' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('mac')}>
              MAC Address {sortConfig.field === 'mac' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('hostname')}>
              Device Info {sortConfig.field === 'hostname' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('lastSeen')}>
              Last Seen {sortConfig.field === 'lastSeen' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th>Open Ports</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedDevices.map(device => (
            <tr key={device.ip} className={device.isOnline ? 'online' : 'offline'}>
              <td style={{ fontFamily: 'Monaco, monospace', fontWeight: '500' }}>{device.ip}</td>
              <td style={{ fontFamily: 'Monaco, monospace', fontSize: '13px', color: '#718096' }}>{device.mac || '-'}</td>
              <td style={{ fontWeight: '500' }}>{formatDeviceInfo(device.hostname, device.vendor, device.deviceType)}</td>
              <td style={{ fontSize: '13px', color: '#718096' }}>{formatDistanceToNow(device.lastSeen, { addSuffix: true })}</td>
              <td style={{ fontFamily: 'Monaco, monospace', fontSize: '12px', color: '#4a5568' }}>{formatPorts(device.ports)}</td>
              <td>
                <span className={device.isOnline ? 'status-online' : 'status-offline'}>
                  {device.isOnline ? '●' : '●'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedDevices.length === 0 && (
        <div className="empty-state">
          {isScanning ? 'Scanning...' : 'No devices found'}
        </div>
      )}
    </div>
  );
};
