import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';

contextBridge.exposeInMainWorld('electronAPI', {
  scanNetwork: (options: any) => ipcRenderer.invoke(IPC_CHANNELS.SCAN_START, options),
  stopScan: () => ipcRenderer.invoke(IPC_CHANNELS.SCAN_STOP)
});
