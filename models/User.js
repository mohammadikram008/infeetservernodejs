// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Check if a provided password matches the stored hashed password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const managerSchema = new mongoose.Schema({
  // firstname: String,
  // lastname: String,
  // address: String,
  // idorpassport: String,
  // email: String,
  // password: String,
  email: String,
  selectedProperties: [String],
});
const managerdetailSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  address: String,
  idorpassport: String,
  email: String,
  password: String,

});
const User = mongoose.model('User', userSchema);
const Manager = mongoose.model('Manager', managerSchema);
const ManagerDetail = mongoose.model('Managerdetail', managerdetailSchema);
module.exports = { User,Manager,ManagerDetail };
// module.exports = mongoose.model('User', userSchema);
