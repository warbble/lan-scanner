// MAC vendor prefixes and device types
const VENDOR_DEVICE_MAP: Record<string, { vendor: string; deviceType: string }> = {
  // Apple devices
  '00:03:93': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:05:02': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:0a:95': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:0d:93': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:11:24': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:14:51': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:16:cb': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:17:f2': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:19:e3': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:1b:63': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:1e:c2': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:21:e9': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:22:41': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:23:12': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:23:df': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:24:36': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:25:00': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:25:4b': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:25:bc': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:26:08': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:26:4a': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:26:b0': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '00:26:bb': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '28:cf:da': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '28:cf:e9': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '3c:07:54': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '40:33:1a': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '40:a6:d9': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '44:d8:84': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '48:43:7c': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '4c:74:03': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '50:ea:d6': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '58:55:ca': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '5c:95:ae': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '5c:f9:38': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '60:03:08': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '60:33:4b': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '60:a3:7d': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '60:fb:42': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '64:a3:cb': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '64:e6:82': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '68:96:7b': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '6c:94:66': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '70:48:0f': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '70:cd:60': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '78:67:d0': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '78:ca:39': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '7c:6d:62': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '7c:d1:c3': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '80:be:05': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '80:e6:50': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '84:38:35': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '84:fc:fe': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '88:1f:a1': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '8c:58:77': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '8c:7c:92': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '90:72:40': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '90:b0:ed': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '98:5a:eb': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  '9c:04:eb': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'a0:99:9b': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'a0:d0:dc': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'a4:83:e7': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'a4:c3:61': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'ac:29:3a': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'b0:65:bd': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'b4:18:d1': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'b8:09:8a': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'b8:17:c2': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'b8:53:ac': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'b8:c7:5d': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'bc:52:b7': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'bc:9f:ef': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'c0:ce:cd': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'c4:b3:01': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'c8:2a:14': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'c8:33:4b': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'c8:89:f3': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd0:23:db': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd0:a6:37': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd4:90:9c': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd4:9a:20': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd8:30:62': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd8:96:95': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'd8:a2:5e': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'dc:2b:2a': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'dc:37:45': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'dc:a9:04': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'e0:b5:2d': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'e4:8b:7f': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'e4:ce:8f': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'e8:06:88': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'ec:35:86': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'f0:18:98': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'f0:24:75': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'f0:db:e2': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'f4:0f:24': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'f4:f1:5a': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },
  'f8:27:93': { vendor: 'Apple', deviceType: 'iPhone/iPad/Mac' },

  // Amazon devices (Echo, Alexa)
  '00:fc:8b': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '04:92:26': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '0c:47:c9': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '10:ae:60': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '18:74:2e': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '38:f7:3d': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '44:65:0d': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '50:dc:e7': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '68:37:e9': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '6c:56:97': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '6c:94:f8': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '74:75:48': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '74:c2:46': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '78:e1:03': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  '84:d6:d0': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  'ac:63:be': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  'b0:7b:25': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  'cc:f4:11': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  'f0:27:2d': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },
  'fc:65:de': { vendor: 'Amazon', deviceType: 'Echo/Alexa' },

  // Google devices (Nest, Chromecast)
  '18:b4:30': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  '30:fd:38': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  '48:d6:d5': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  '54:60:09': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  '6c:ad:f8': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  'a0:21:95': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  'b4:f6:1c': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  'da:a1:19': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  'e0:75:7d': { vendor: 'Google', deviceType: 'Nest/Chromecast' },
  'f4:f5:d8': { vendor: 'Google', deviceType: 'Nest/Chromecast' },

  // Samsung devices
  '00:12:fb': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:15:99': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:16:32': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:17:c9': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:1a:8a': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:1d:25': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:1e:7d': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:21:19': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:23:39': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '00:26:37': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '08:08:c2': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '08:d4:2b': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '10:30:47': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '14:7d:da': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '18:3d:a2': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '20:64:32': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '28:39:5e': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '2c:44:01': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '30:07:4d': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '34:23:ba': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '38:aa:3c': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '40:0e:85': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '40:b8:9a': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '44:5e:f3': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '50:32:75': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '50:cc:f8': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '58:50:e6': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '60:6d:c7': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '68:a8:6d': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '78:1f:db': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '78:59:5e': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '7c:1c:4e': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '7c:61:66': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '88:32:9b': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '8c:71:f8': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  '94:35:0a': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'a0:8e:f8': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'a0:f3:c1': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'b4:62:93': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'bc:72:b1': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'c0:bd:d1': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'c4:57:6e': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'c8:ba:94': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'd0:22:be': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'e8:50:8b': { vendor: 'Samsung', deviceType: 'Phone/TV' },
  'ec:1f:72': { vendor: 'Samsung', deviceType: 'Phone/TV' },

  // Sony PlayStation
  '00:0d:1a': { vendor: 'Sony', deviceType: 'PlayStation' },
  '00:13:15': { vendor: 'Sony', deviceType: 'PlayStation' },
  '00:19:c5': { vendor: 'Sony', deviceType: 'PlayStation' },
  '00:1b:fb': { vendor: 'Sony', deviceType: 'PlayStation' },
  '00:1f:e1': { vendor: 'Sony', deviceType: 'PlayStation' },
  '00:24:8c': { vendor: 'Sony', deviceType: 'PlayStation' },
  '7c:bb:8a': { vendor: 'Sony', deviceType: 'PlayStation' },
  'a4:5c:27': { vendor: 'Sony', deviceType: 'PlayStation' },
  'a4:83:e7': { vendor: 'Sony', deviceType: 'PlayStation' },

  // Microsoft Xbox
  '00:0d:3a': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:12:5a': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:15:5d': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:17:fa': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:1d:d8': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:21:5c': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:22:48': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:24:d7': { vendor: 'Microsoft', deviceType: 'Xbox' },
  '00:50:f2': { vendor: 'Microsoft', deviceType: 'Xbox' },
  'b8:27:eb': { vendor: 'Microsoft', deviceType: 'Xbox' },

  // Roku
  'b0:a7:37': { vendor: 'Roku', deviceType: 'Streaming Device' },
  'b8:a1:75': { vendor: 'Roku', deviceType: 'Streaming Device' },
  'cc:6d:a0': { vendor: 'Roku', deviceType: 'Streaming Device' },
  'd8:31:34': { vendor: 'Roku', deviceType: 'Streaming Device' },

  // TP-Link routers/devices
  '14:cc:20': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  '1c:61:b4': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  '50:c7:bf': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  '60:e3:27': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  '94:10:3e': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  'a0:f3:c1': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  'c0:25:e9': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  'ec:08:6b': { vendor: 'TP-Link', deviceType: 'Router/Access Point' },
  'f4:ec:38': { vendor: 'TP-Link', deviceType: 'Router/Access Point' }
};

export function detectDeviceType(mac: string): { vendor?: string; deviceType?: string } {
  if (!mac) return {};
  
  // Normalize MAC address and get the first 3 octets (vendor prefix)
  const normalizedMac = mac.toLowerCase().replace(/[:-]/g, '');
  const vendorPrefix = normalizedMac.substring(0, 6);
  const colonPrefix = vendorPrefix.match(/.{2}/g)?.join(':') || '';
  
  const deviceInfo = VENDOR_DEVICE_MAP[colonPrefix];
  if (deviceInfo) {
    return {
      vendor: deviceInfo.vendor,
      deviceType: deviceInfo.deviceType
    };
  }
  
  return {};
}

export function formatDeviceInfo(hostname?: string, vendor?: string, deviceType?: string): string {
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