const remoteControlService = require('../src/main/services/remote-control-service.js');

remoteControlService.init();
const server = remoteControlService.start(4545);

const os = require('os');
const interfaces = os.networkInterfaces();
const addresses = [];

for (const name of Object.keys(interfaces)) {
  for (const net of interfaces[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      addresses.push(net.address);
    }
  }
}

console.log('====================================================');
console.log('      CENTRO DE DESCARGAS BIBLE ACTIVO EN RED');
console.log('====================================================');
console.log('En la otra laptop abre cualquiera de estos enlaces:');
addresses.forEach(ip => {
  console.log(`  🌐 Centro de descargas: http://${ip}:4545/download`);
  console.log(`  📥 Instalador Windows:  http://${ip}:4545/download/BIBLE-Instalador-Windows.exe`);
});
console.log('----------------------------------------------------');
console.log('Presiona Ctrl+C para detener el servidor.');

