const bcrypt = require('bcrypt');
const Appartments = require("./models/Appartment");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer'); // for handling file uploads
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const router = express.Router();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 
const myMiddleware = (req, res, next) => {
    // Middleware logic
    next(); // Call next() to pass control to the next middleware
  };
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });


  const User = mongoose.model('Infeet', userSchema);
  router.get("/", async (req, res) => {
    try {
      const tasks = await Appartments.find();
      // res.send(tasks);
      res.status(200).json(tasks);
    } catch (error) {
      res.send(error);
    }
  });

  
  router.post('/', upload.single('image'), async (req, res) => {
  const { appartmentaddres, price, area } = req.body;

 

  try {
     const newTask = new Appartments({
    appartmentaddres:req.body.appartmentaddres,
    price:req.body.price,
    area:req.body.area,
    image: req.file.path, // Save the image path in your schema
  });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully.' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
  // router.post("/", async (req, res) => {
  //   try {
  //     const task = await new Appartments(req.body).save();
  //     res.send(task);
  //   } catch (error) {
  //     res.send(error);
  //   }
  // });
  
  // Signup route
  router.post('/signup', (req, res) => {
    // Extract user data from request body
    const { username, password } = req.body;
  
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }
  
      // Create a new user in the database
      const user = new User({ username, password: hash });
      user.save().then(() => {
        // Return a success message or perform further actions
        res.status(200).json({ message: 'Signup successful' });
      })
      .catch((error) => {
        // Handle the error
        res.status(500).json({ error: 'Error saving user to database' });
      });
    });
   
  });
  
  // Login route
  router.post('/login', (req, res) => {
    // Extract user data from request body
    const { username, password } = req.body;
  
    // Find the user in the database
    // User.findOne({ username }, (err, user) => {
    //   if (err) {
    //     return res.status(500).json({ error: 'Error finding user' });
    //   }
    //   if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
  
    //   // Compare the password with the hashed password in the database
    //   bcrypt.compare(password, user.password, (err, result) => {
    //     if (err) {
    //       return res.status(500).json({ error: 'Error comparing passwords' });
    //     }
    //     if (!result) {
    //       return res.status(401).json({ error: 'Invalid password' });
    //     }
  
    //     // Generate a JWT token and send it as a response
    //     const token = jwt.sign({ username: user.username }, 'secretkey');
    //     res.status(200).json({ token });
    //   });
    // });
    User.findOne({ username })
  .exec()
  .then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password
    bcrypt.compare(password, user.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT token and send it as a response
        const token = jwt.sign({ username: user.username }, 'secretkey');
        res.status(200).json({ token });
      });
  })
  .catch((error) => {
    // Handle the error
    res.status(500).json({ error: 'Error finding user' });
  });

  });
  module.exports = router;