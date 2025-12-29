const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { initializeSpeedInsights } = require('./lib/speedInsights');

dotenv.config();
connectDB();
initializeSpeedInsights();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Backend is running!');
  });
  
app.use('/api/tasks', taskRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
