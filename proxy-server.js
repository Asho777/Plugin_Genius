const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'anthropic-version']
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Proxy endpoint for Claude Sonnet 4 API
app.post('/api/claude', async (req, res) => {
  console.log('🔄 Proxy: Received request to Claude API');
  console.log('📋 Request headers:', req.headers);
  console.log('📦 Request body keys:', Object.keys(req.body));
  
  try {
    const { apiKey, ...requestBody } = req.body;
    
    if (!apiKey) {
      console.log('❌ Proxy: No API key provided');
      return res.status(400).json({ error: 'API key is required' });
    }
    
    console.log('🌐 Proxy: Making request to Anthropic API...');
    
    // Use dynamic import for fetch in Node.js
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📥 Proxy: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Proxy: API error:', errorText);
      return res.status(response.status).json({ 
        error: `API request failed: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }
    
    const data = await response.json();
    console.log('✅ Proxy: Successfully received response from Claude API');
    console.log('📊 Response data keys:', Object.keys(data));
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Proxy: Error:', error);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`🔗 Claude API proxy available at http://localhost:${PORT}/api/claude`);
});
