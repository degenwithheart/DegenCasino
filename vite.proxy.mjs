import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create Express server for API
const app = express();

// Add JSON body parser
app.use(express.json());

// Game stats endpoint
app.post('/api/game-stats', (req: Request, res: Response) => {
  const { gameId } = req.body;
  // Mock response for development
  res.json({
    status: 'success',
    data: {
      totalPlays: gameId === 'mines' ? 150 : 
                 gameId === 'dice' ? 200 : 
                 gameId === 'magic8ball' ? 75 : 100,
      recentPlays: []
    }
  });
});

// Start server
const port = 4003;
app.listen(port, () => {
  console.log(`Dev API server running on port ${port}`);
});