const { spawn } = require('child_process');
const path = require('path');

// Limpiar ELECTRON_RUN_AS_NODE para que Electron inicie en modo aplicación completa
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const electronBinary = require('electron');

const args = ['.'];
if (process.platform === 'linux') {
  args.unshift('--no-sandbox');
}

// Iniciar Electron con herencia de stdio
const child = spawn(electronBinary, args, {
  stdio: 'inherit',
  env
});

child.on('close', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[BIBLE] Error al iniciar Electron:', err);
  process.exit(1);
});

