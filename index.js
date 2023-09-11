const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
const tasks = require("./server");
const connection = require("./db");
const chat =require("./models/chatserver")




// Connect to MongoDB
connection();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); 
app.use("/api/tasks", tasks);

app.use((req, res, next) => {
  // Set CORS headers to allow requests from your React app
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-mbx-apikey');
  next();
});

app.get('/api/ticker', async (req, res) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// chat();

app.listen(3005, () => {
  console.log('Server running on port 3005');
});



