import React, { useState } from 'react';
import { DeviceTable } from './components/DeviceTable/DeviceTable';
import { Device } from '../shared/types';

declare global {
  interface Window {
    electronAPI: {
      scanNetwork: (options: any) => Promise<any>;
      stopScan: () => Promise<any>;
    };
  }
}

export function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      const result = await window.electronAPI.scanNetwork({});
      if (result.success) {
        setDevices(result.devices);
      } else {
        setError(result.error);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleStop = async () => {
    await window.electronAPI.stopScan();
    setIsScanning(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 LAN Scanner</h1>
        <div className="controls">
          {!isScanning ? (
            <button onClick={handleScan} className="btn-primary">
              Scan Network
            </button>
          ) : (
            <button onClick={handleStop} className="btn-stop">
              Stop Scanning
            </button>
          )}
        </div>
      </header>
      
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}
      
      <main>
        <DeviceTable devices={devices} isScanning={isScanning} />
      </main>
    </div>
  );
}
