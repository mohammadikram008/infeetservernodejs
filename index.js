const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
const tasks = require("./server");
const connection = require("./db");
const chat =require("./models/chatserver")
const port = process.env.PORT || 3005;



// Connect to MongoDB
connection();
app.use(express.json());
app.use(cors());
// Enable CORS for your frontend origin
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with the origin of your frontend
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// }));
app.use('/uploads', express.static('uploads')); 
app.use("/api/tasks", tasks);

// app.use((req, res, next) => {
//   // Set CORS headers to allow requests from your React app
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, x-mbx-apikey');
//   next();
// });

// app.get('/api/ticker', async (req, res) => {
//   try {
//     const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// chat();

app.listen(port, () => {
  console.log('Server running on port 3005');
});



