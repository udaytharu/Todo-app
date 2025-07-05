// Production start script
const { spawn } = require('child_process');

console.log('Starting Todo App in production mode...');

// Set production environment
process.env.NODE_ENV = 'production';

// Start the server
const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: process.env
});

server.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

server.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
    process.exit(code);
}); 