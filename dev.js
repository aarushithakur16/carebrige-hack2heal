const { spawn } = require('child_process');

console.log('=======================================================');
console.log('🚀 Starting CareBridge Unified Environment...');
console.log('   - Backend API : http://localhost:4000');
console.log('   - Frontend UI : http://localhost:5173');
console.log('   - Health Check: http://localhost:4000/health');
console.log('=======================================================\n');

// Use npm.cmd on Windows, npm on Unix
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const backend = spawn(npmCmd, ['run', 'dev'], { 
  cwd: './backend', 
  shell: true, 
  stdio: 'inherit' 
});

const frontend = spawn(npmCmd, ['run', 'dev'], { 
  cwd: './frontend', 
  shell: true, 
  stdio: 'inherit' 
});

let isShuttingDown = false;
const cleanup = () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n🛑 Shutting down CareBridge servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('error', (err) => console.error('Backend process error:', err));
frontend.on('error', (err) => console.error('Frontend process error:', err));
