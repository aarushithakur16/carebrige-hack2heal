const { spawn } = require('child_process');

console.log('-------------------------------------------------------');
console.log('🚀 Starting CareBridge Unified Environment...');
console.log('   - Backend API: http://localhost:4000');
console.log('   - Frontend UI: http://localhost:5173');
console.log('-------------------------------------------------------\n');

const backend = spawn('npm', ['run', 'dev'], { 
  cwd: './backend', 
  shell: true, 
  stdio: 'inherit' 
});

const frontend = spawn('npm', ['run', 'dev'], { 
  cwd: './frontend', 
  shell: true, 
  stdio: 'inherit' 
});

const cleanup = () => {
  console.log('\n🛑 Shutting down CareBridge servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
