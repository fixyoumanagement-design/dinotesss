import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApiHandler } from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Mount API routes
app.use(createApiHandler());

// Serve static assets from built Vite client
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`dinicatet server running on port ${port}`);
});
