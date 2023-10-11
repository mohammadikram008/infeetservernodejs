const bcrypt = require('bcrypt');

const Appartments = require("./models/Appartment");
const Userpassword = require("./models/User");
const Verification = require('./models/Verification');
const User =require("./models/User")
//for send forgot passsword to email 
const nodemailer = require('nodemailer');

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
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));


// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mohammadikram20001@gmail.com', // Replace with your email address
    pass: 'pakstar@123!', // Replace with your email password
  },
});





const myMiddleware = (req, res, next) => {
  // Middleware logic
  next(); // Call next() to pass control to the next middleware
};
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });


// const User = mongoose.model('Infeet', userSchema);
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
      appartmentaddres: req.body.appartmentaddres,
      price: req.body.price,
      area: req.body.area,
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
  const { username, email, password } = req.body;

    // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Create a new user in the database
    const user = new User({ username,email, password: hash });
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
  const { email, password } = req.body;

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
  User.findOne({ email })
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
   const token = jwt.sign({ email: user.email }, 'secretkey');
   res.status(200).json({ token });
});
    })
    .catch((error) => {
      // Handle the error
      res.status(500).json({ error: 'Error finding user' });
    });

});

//  password change
router.post('/password-change', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID or email (replace with your logic)
    const user = await Userpassword.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password matches the one in the database
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

//  user profile data
router.post('/profile', async (req, res) => {
  try {
    const {
      legalName,
      fullAddress,
      idOrPassport,
      paymentMethod,
      bankData,
      cryptoWalletData,
    } = req.body;

    // Create a new user document with the provided data
    const user = new Verification({
      legalName,
      fullAddress,
      idOrPassport,
      paymentMethod,
      bankAccount: bankData,
      cryptoWallet: cryptoWalletData,
    });

    // Save the user document to MongoDB
    await user.save();

    res.status(201).json({ message: 'Profile data saved successfully' });
  } catch (error) {
    console.error('Error saving profile data:', error);
    res.status(500).json({ message: 'Error saving profile data' });
  }
});

//forgot password 
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a unique reset token and save it in your database along with the user's email

    // Send a reset password email to the user
    const mailOptions = {
      to: email,
      from: 'mohammadikram20001@gmail.com', // Replace with your email address
      subject: 'Password Reset',
      html: `
        <p>You are receiving this email because you (or someone else) requested a password reset.</p>
        <p>Click this <a href="${resetLink}">link</a> to reset your password.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset password link sent to your email.' });
  } catch (error) {
    console.error('Error sending reset password link:', error);
    res.status(500).json({ message: 'Failed to send reset password link.' });
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = router;