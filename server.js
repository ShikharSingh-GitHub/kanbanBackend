const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
// Configure CORS explicitly so deployed backend only allows requests from
// frontend origin(s). Set `FRONTEND_URL` in Vercel to your frontend URL
// (e.g. https://kanban-frontend-pi.vercel.app). If not set, allow all origins
// (useful for local dev).
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
// Allow popups used by Firebase auth to close correctly when COOP is enforced
app.use((req, res, next) => {
  // Allow popups to call window.close() across origins
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.get('/', (req, res) => {
    res.send('Backend is running!');
  });
  
app.use('/api/tasks', taskRoutes);

// Basic error handler that ensures CORS headers are present even on errors
app.use((err, req, res, next) => {
  // Ensure CORS header is present so browser can read the response
  if (FRONTEND_URL) {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL === '*' ? '*' : FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500).json({ message: err && err.message ? err.message : 'Internal Server Error' });
});

// If this file is run directly, start the server. When required by a serverless
// platform (like Vercel), export the app instead so the platform can handle
// the request lifecycle.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}
