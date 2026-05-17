import { spawn } from 'child_process';
import path from 'path';

const isWindows = process.platform === 'win32';

// Start backend
const backend = spawn('npm', ['start'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

// Start frontend after a short delay
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'build', '-w', 'frontend'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('close', () => {
    spawn('npm', ['run', 'preview', '-w', 'frontend'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true
    });
  });
}, 2000);

process.on('SIGINT', () => {
  backend.kill();
  process.exit(0);
});
