import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { NetworkScanner } from './scanner/NetworkScanner';
import { IPC_CHANNELS } from '../shared/constants';

let mainWindow: BrowserWindow | null = null;
let scanner: NetworkScanner | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../../assets/icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; connect-src \'self\' ws://localhost:*']
      }
    });
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(async () => {
  // Initialize scanner
  scanner = new NetworkScanner({
    pingTimeout: 1000,
    arpTimeout: 1000,
    concurrency: 32,
    enablePortScan: true
  });

  // Setup IPC handlers
  ipcMain.handle(IPC_CHANNELS.SCAN_START, async (_, options) => {
    try {
      const result = await scanner!.scanNetwork(options);
      return { success: true, ...result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.SCAN_STOP, async () => {
    await scanner!.stopScan();
    return { success: true };
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
