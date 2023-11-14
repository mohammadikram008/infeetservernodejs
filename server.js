const bcrypt = require('bcrypt');
const tokenExpiration = '1h';
const Appartments = require("./models/Appartment");
const Addtransaction = require("./models/Addtransaction");
const { Propertydetail, Transactiondetail, AlltransactionsSchema, Transactionforapprovement } = require('./models/property');
const { User, Manager, ManagerDetail, managerEmails } = require("./models/User")
const Userpassword = require("./models/User");
const Verification = require('./models/Verification');
//for send forgot passsword to email 
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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
// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
const tokens = new Map();

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mohammadikram20001@gmail.com', // Replace with your email address
    pass: 'brez sqbk tbln nzfm', // Replace with your email password
  },
});

// Generate a reset token
function generateResetToken(email) {
  // Create a payload with the user's email
  const payload = { email };

  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' }); // Expires in 1 hour
  return token;
}


const myMiddleware = (req, res, next) => {
  // Middleware logic
  next(); // Call next() to pass control to the next middleware
};

//add property detail
router.post('/properties', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      country,
      propertytype,
      price
    } = req.body;

    // Create a new user document with the provided data
    const properties = new Propertydetail({
      name,
      address,
      city,
      country,
      propertytype,
      price: req.body.price,
      image: req.file.path,
    });

    // Save the user document to MongoDB
    await properties.save();
    res.status(201).json({ message: 'Property  saved successfully' });
    // const propertyData = req.body;
    // const property = await Property.create(propertyData);
    // await property.save();
    // res.status(201).json(property); 
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Could not create property' });
  }
});

//get property
router.get("/properties", async (req, res) => {
  try {
    const Property = await Propertydetail.find();
    // res.send(tasks);
    res.status(200).json(Property);
  } catch (error) {
    res.send(error);
  }
});

// Add a transaction to a property
// router.post('properties/:propertyId/transactions', async (req, res) => {
//   try {
//     const { propertyId } = req.params;
//     console.log("prama",req.params)
//     const transactionData = req.body;

//     const property = await Propertydetail.findById(propertyId);

//     if (!property) {
//       return res.status(404).json({ error: 'Property not found' });
//     }

//     const transaction = new Transactiondetail(transactionData);
//     property.transactions.push(transaction);
//     await property.save();

//     res.status(201).json(transaction);
//   } catch (error) {
//     console.error('Error adding transaction:', error);
//     res.status(500).json({ error: 'Could not add transaction' });
//   }
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

//delete approved Transaction
router.post('/deleteapprovedtransaction/:id', upload.single('image'), async (req, res) => {
  try {
    // Extract the ID from the URL parameter
    const transactionId = req.params.id;
    const id = req.body._id
    try {
      const property = await Propertydetail.findById(transactionId);
      console.log("property", property)
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const transaction = new Transactiondetail(
        {
          id: req.body.id,
          amount: req.body.amount,
          account: req.body.account,
          date: req.body.date,
          comments: req.body.comments,
          balance: req.body.balance,
          image: req.body.image, // Save the image path in your schema
        });

      property.transactions.push(transaction);
      await property.save();
      const deletedTransaction = await Transactionforapprovement.findOneAndDelete({ _id: id });

      if (!deletedTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.status(200).json({ message: 'Transaction deleted', deletedTransaction });

    } catch (error) {

      res.status(500).json({ message: 'Internal server error.' });
    }
    // const transactionId = req.params.id;
    // // const property = await Propertydetail.transactions.findOne(transactionId);
    // // console.log("ap", property)

    // const deletedTransaction = await Transactionforapprovement.findOneAndDelete({ _id: transactionId });

    // if (!deletedTransaction) {
    //   return res.status(404).json({ error: 'Transaction not found' });
    // }

    // res.status(200).json({ message: 'Transaction deleted', deletedTransaction });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete the transaction' });
  }
});
// get  all transaction through id
router.post('/getallapp', upload.single('image'), async (req, res) => {

  const { propertyId } = req.body;
  console.log("id", propertyId)
  try {
    // const property = await Propertydetail.findById(propertyId);
    // if (!property) {
    //   return res.status(404).json({ error: 'Property not found' });
    // }
    // console.log("property",property)
    // res.status(200).json(property);
    // const transaction = new Transactiondetail(
    //   {
    //     id: req.body.id,
    //     amount: req.body.amount,
    //     account: req.body.account,
    //     date: req.body.date,
    //     comments: req.body.comments,
    //     balance: req.body.balance,
    //     image: req.file.path, // Save the image path in your schema
    //   });
    // const transactionforapprove = new Transactionforapprovement(
    //   {
    //     id: req.body.id,
    //     amount: req.body.amount,
    //     account: req.body.account,
    //     date: req.body.date,
    //     comments: req.body.comments,
    //     balance: req.body.balance,
    //     image: req.file.path, // Save the image path in your schema
    //   });
    // console.log("transaction", transaction)
    // property.transactions.push(transaction);
    // await transactionforapprove.save();
    // await property.save();
    // await newTask.save();
    // res.status(201).json({ message: 'Add Transaction  successfully.' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
// add transaction
router.post('/addtransaction/:propertyId/transactions', upload.single('image'), async (req, res) => {

  const { propertyId } = req.params;
  try {
    const property = await Propertydetail.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    const transaction = new Transactiondetail(
      {
        id: req.body.id,
        amount: req.body.amount,
        account: req.body.account,
        date: req.body.date,
        comments: req.body.comments,
        balance: req.body.balance,
        image: req.file.path, // Save the image path in your schema
      });
    // const transactionforapprove = new Transactionforapprovement(
    //   {
    //     id: req.body.id,
    //     amount: req.body.amount,
    //     account: req.body.account,
    //     date: req.body.date,
    //     comments: req.body.comments,
    //     balance: req.body.balance,
    //     image: req.file.path, // Save the image path in your schema
    //   });
    // console.log("transaction", transaction)
    property.transactions.push(transaction);
    // await transactionforapprove.save();
    await property.save();
    // await newTask.save();
    res.status(201).json({ message: 'Add Transaction  successfully.' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//get  transaction for approvement
router.get("/getapprovedtransaction", async (req, res) => {
  try {
    // const tasks = await Transactionforapprovement.find();
    const transactions = await AlltransactionsSchema.find();
    // res.send(tasks);

    const propertyDetails = [];

    for (const transaction of transactions) {

      const propertyId = transaction.id;
      // Search for property details using the property ID
      const propertyDetail = await Propertydetail.findOne({ _id: propertyId });

      if (propertyDetail) {
        // Add the property details to the result array
        propertyDetails.push(propertyDetail);
      }
    }

    //  console.log("AllTransactions",propertyDetails)
    res.status(200).json(propertyDetails);

  } catch (error) {
    res.send(error);
  }
});

//get transaction
router.get("/gettransaction", async (req, res) => {
  try {
    const tasks = await Addtransaction.find();
    // res.send(tasks);
    res.status(200).json(tasks);
  } catch (error) {
    res.send(error);
  }
});

//Add All Transaction
router.post("/addalltransactions", async (req, res) => {
  try {
    // const dataArray = req.body;
    const id = req.body._id;
    console.log("id", req.body._id);
    // Check if any of the transactions already exist in the database
    // const existingTransactions = await AlltransactionsSchema.find({ transactions: { $in: dataArray } });

    // if (existingTransactions.length > 0) {
    //   return res.status(400).json({ error: 'Some or all transactions already exist in the database' });
    // }

    const newTransaction = new AlltransactionsSchema({
      id: id
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);

  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Signup route
router.post('/signup', (req, res) => {
  // Extract user data from request body
  const { username, email, password } = req.body;

  // Check if a user with the same email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash the password
      bcrypt.hash(password, 10)
        .then((hash) => {
          // Create a new user in the database
          const user = new User({ username, email, password: hash });
          return user.save();
        })
        .then(() => {
          // Return a success message or perform further actions
          res.status(200).json({ message: 'Signup successful' });
        })
        .catch((error) => {
          // Handle any errors during password hashing or saving to the database
          res.status(500).json({ error: 'Error saving user to the database' });
        });
    })
    .catch((error) => {
      // Handle errors related to finding an existing user
      res.status(500).json({ error: 'Error checking user existence' });
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
  const { email, currentPassword, newPassword } = req.body;
  console.log("pass", req.body)
  try {
    // Find the user by ID (you should validate and sanitize the userId)
    const user = await User.findOne({ email });
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
router.post('/forgot-password', async (req, res) => {
  try {
    // console.log('Request Data:', req.body);
    const { email } = req.body;
    const resetToken = generateResetToken(email);
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Generate a unique reset token and save it in your database along with the user's email
    // const resetLink = 'https://example.com/reset-password?token=your_reset_token';

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

//  add managers email
router.post('/addmanager', async (req, res) => {
  try {
    // const {
    //   firstname,
    //   lastname,
    //   address,
    //   idorpassport,
    //   email,
    //   password,

    // } = req.body;
    const { email, selectedProperties } = req.body;
    // Generate a unique token for password reset
    const token = crypto.randomBytes(32).toString('hex');

    // Store the token with the associated email in memory or a database
    tokens.set(email, token);

    // Send an email to the user with a link to reset their password
    const resetLink = `http://yourwebsite.com/resetPassword?token=${token}`;
    const mailOptions = {
      from: 'mohammadikram20001@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Email not sent' });
      } else {
        const manager = new Manager({

          email, selectedProperties
        });

        // Save the user document to MongoDB
        manager.save();
        console.log('Password reset email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      }
    });
    // Create a new user document with the provided data

  } catch (error) {
    console.error('Error saving profile data:', error);
    res.status(500).json({ message: 'Error saving profile data' });
  }
});

//get All managers
router.get("/getmanager", async (req, res) => {
  try {
    const managers = await ManagerDetail.find();
    // res.send(tasks);
    res.status(200).json(managers);
  } catch (error) {
    res.send(error);
  }
});
//save manager profile
router.post('/addmanagerdetail', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      address,
      idorpassport,
      email,
      password,
    } = req.body;

    const manager = new ManagerDetail({
      firstname,
      lastname,
      address,
      idorpassport,
      email,
      password,
    });

    // Save the user document to MongoDB
    await manager.save();
    res.status(200).json({ message: 'Manager Save Successfully' });

  } catch (error) {
    console.error('Error saving profile data:', error);
    res.status(500).json({ message: 'Error saving profile data' });
  }
});
//save  manager emails
router.post('/addmanageremail', async (req, res) => {
  try {
    const {

      email,

    } = req.body;

    const manager = new managerEmails({

      email,

    });

    // Save the user document to MongoDB
    await manager.save();
    res.status(200).json({ message: 'Manager Email Save Successfully' });

  } catch (error) {
    console.error('Error saving profile data:', error);
    res.status(500).json({ message: 'Error saving profile data' });
  }
});
//get All managers emails
router.get("/getmanageremails", async (req, res) => {
  try {
    const managers = await managerEmails.find();
    // res.send(tasks);
    res.status(200).json(managers);
  } catch (error) {
    res.send(error);
  }
});
//update specific transactions
router.put('/properties/:propertyId/transactions/:transactionId', upload.single('image'), async (req, res) => {
  const { propertyId, transactionId } = req.params;
  const { amount, account, date, comments, balance, image } = req.body;

  try {
    // Find the property by ID
    const property = await Propertydetail.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find the transaction within the transactions array
    const transaction = property.transactions.find(
      (transaction) => transaction._id.toString() === transactionId
    );

    // Check if the transaction exists
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the transaction details
    transaction.amount = amount;
    transaction.account = account;
    transaction.date = date;
    transaction.comments = comments;
    transaction.balance = balance;
    transaction.image = image;

    // Save the updated property to the database
    await property.save();

    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//delete un aproved transaction
router.delete('/deleteunapprovedtransaction/:id', async (req, res) => {
  try {
    const { transactionId } = req.params.id;
    console.log("tra", transactionId)
    // Find and delete the transaction by ID
    const deletedTransaction = await Transactionforapprovement.findByIdAndDelete({ _id: req.params.id });

    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    return res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting the transaction.' });
  }
});
//delete transaction from prperty
router.delete('/properties/:propertyId/transactions/:transactionId', async (req, res) => {
  const { propertyId, transactionId } = req.params;

  try {
    // Find the property by ID
    const property = await Propertydetail.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find the index of the transaction within the transactions array
    const transactionIndex = property.transactions.findIndex(
      (transaction) => transaction._id.toString() === transactionId
    );

    // Check if the transaction exists
    if (transactionIndex === -1) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Remove the transaction from the array
    property.transactions.splice(transactionIndex, 1);

    // Save the updated property to the database
    await property.save();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;