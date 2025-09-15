#!/usr/bin/env node

/**
 * Keep-alive script for TengaPesa Survey
 * This script can be run externally to ping the service and keep it alive
 */

const https = require('https');
const http = require('http');

const SERVICE_URL = process.env.SERVICE_URL || 'https://tengapesa.onrender.com';
const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes
const HEALTH_CHECK_INTERVAL = 30 * 1000; // 30 seconds

console.log(`Starting keep-alive monitor for ${SERVICE_URL}`);
console.log(`Ping interval: ${PING_INTERVAL / 1000}s`);
console.log(`Health check interval: ${HEALTH_CHECK_INTERVAL / 1000}s`);

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: 10000,
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function pingService() {
  try {
    console.log(`[${new Date().toISOString()}] Pinging service...`);
    
    const response = await makeRequest(`${SERVICE_URL}/keep-alive`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`✅ Service is alive - Uptime: ${Math.round(data.uptime)}s, Last Activity: ${data.lastActivity}`);
    } else {
      console.log(`⚠️  Service responded with status: ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Failed to ping service: ${error.message}`);
  }
}

async function healthCheck() {
  try {
    const response = await makeRequest(`${SERVICE_URL}/healthz`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`[${new Date().toISOString()}] Health check passed - Status: ${data.status}`);
    } else {
      console.log(`[${new Date().toISOString()}] Health check failed - Status: ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`[${new Date().toISOString()}] Health check error: ${error.message}`);
  }
}

// Start the monitoring
console.log('Starting monitoring...');

// Initial ping
pingService();

// Regular pings to keep service alive
setInterval(pingService, PING_INTERVAL);

// Regular health checks
setInterval(healthCheck, HEALTH_CHECK_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down keep-alive monitor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down keep-alive monitor...');
  process.exit(0);
});
