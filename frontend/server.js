
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const backendUrl = process.env.BACKEND_URL;

// Proxy API requests
if (backendUrl) {
  app.use('/api', createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
  }));
}

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle every other route with index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`);
});
