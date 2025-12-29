const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
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

// If this file is run directly, start the server. When required by a serverless
// platform (like Vercel), export the app instead so the platform can handle
// the request lifecycle.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}
