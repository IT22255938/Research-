/**
 * Frontend Server
 * Simple Express server to serve the HTML frontend
 * Allows the browser-based voice learning module to run
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Serve static files from project root
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve gamification dashboard
app.get('/gamification', (req, res) => {
  res.sendFile(path.join(__dirname, 'gamification.html'));
});

// API health endpoint (for testing)
app.get('/api/frontend/health', (req, res) => {
  res.json({
    status: 'operational',
    component: 'frontend-server',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  Voice Learning Module - Frontend Server ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
  console.log(`✓ Frontend running at: http://localhost:${PORT}`);
  console.log(`✓ Open browser: http://localhost:${PORT}\n`);
  console.log(`Make sure backend is running at: http://localhost:5000`);
  console.log(`Press CTRL+C to stop\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down frontend server...');
  process.exit(0);
});
