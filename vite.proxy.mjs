import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create Express server for API
const app = express();

// Add JSON body parser
app.use(express.json());
// Start server
const port = 4003;
app.listen(port, () => {
  console.log(`Dev API server running on port ${port}`);
});