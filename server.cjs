const express = require('express');
const path = require('path');
const compression = require('compression');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

// Keep-alive mechanism to prevent Render spin-down
let lastActivity = Date.now();
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Update last activity on any request
app.use((req, res, next) => {
  lastActivity = Date.now();
  next();
});

// Keep-alive endpoint to ping the service
app.get('/keep-alive', (req, res) => {
  lastActivity = Date.now();
  res.status(200).json({ 
    status: 'alive', 
    lastActivity: new Date(lastActivity).toISOString(),
    uptime: process.uptime()
  });
});

// Background keep-alive mechanism
setInterval(() => {
  const timeSinceLastActivity = Date.now() - lastActivity;
  
  // If no activity for 4 minutes, make a request to ourselves
  if (timeSinceLastActivity > 4 * 60 * 1000) {
    console.log('No activity detected, pinging keep-alive endpoint');
    fetch(`http://localhost:${PORT}/keep-alive`)
      .catch(err => console.log('Keep-alive ping failed:', err.message));
  }
}, KEEP_ALIVE_INTERVAL);

// Enable gzip compression for faster loading
app.use(compression());

// Enhanced security and caching headers
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Enhanced caching headers
  if (req.url.match(/\.(css|js)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
  } else if (req.url.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
  } else if (req.url === '/' || req.url === '/index.html') {
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes for HTML
  } else {
    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute for other files
  }
  
  next();
});

// Serve static files from the dist directory with enhanced options
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set specific cache headers for different file types
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    } else if (path.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Health check endpoint for Render with more detailed info
app.get('/healthz', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    lastActivity: new Date(lastActivity).toISOString(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.status(200).json(healthData);
});

// API endpoint for survey submissions (if needed for direct server processing)
app.post('/api/submit-feedback', express.json(), (req, res) => {
  // This could be used for server-side processing if needed
  // For now, we'll just acknowledge the request
  res.status(200).json({ 
    message: 'Feedback received', 
    timestamp: new Date().toISOString() 
  });
});

// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Keep-alive mechanism active (${KEEP_ALIVE_INTERVAL / 1000}s interval)`);
});
