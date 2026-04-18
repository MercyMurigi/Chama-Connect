import http from 'node:http';
import app from './app.ts';

const PORT = Number(process.env.PORT || 3001);
const server = http.createServer(app);

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[ChamaConnect] Port ${PORT} is already in use.\n` +
        `  Stop the other API process, or set PORT in .env to a free port (Vite uses PORT for /api proxy).`,
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`ChamaConnect API listening on http://localhost:${PORT}`);
});
