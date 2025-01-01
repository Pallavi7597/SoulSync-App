// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Simple API Route
app.get('/', (req, res) => {
  res.send('Hello from SoulSync Backend!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
