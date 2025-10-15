const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL(`data:text/html,
    <html>
      <body style="font-family: system-ui; padding: 20px;">
        <h1>LAN Scanner</h1>
        <button onclick="scan()" style="padding: 10px 20px; font-size: 16px;">Scan Network</button>
        <pre id="output" style="margin-top: 20px; padding: 10px; background: #f5f5f5;"></pre>
        <script>
          const { exec } = require('child_process');
          
          function scan() {
            document.getElementById('output').textContent = 'Scanning...';
            
            exec('arp -a', (err, stdout) => {
              if (err) {
                document.getElementById('output').textContent = 'Error: ' + err.message;
                return;
              }
              
              const devices = [];
              const lines = stdout.split('\\n');
              
              for (const line of lines) {
                const match = line.match(/\\(([\\d.]+)\\)\\s+at\\s+([\\da-f:]+)/i);
                if (match) {
                  devices.push(match[1] + ' - ' + match[2]);
                }
              }
              
              document.getElementById('output').textContent = 
                devices.length ? 'Found devices:\\n' + devices.join('\\n') : 'No devices found';
            });
          }
        </script>
      </body>
    </html>
  `);
});

app.on('window-all-closed', () => {
  app.quit();
});
