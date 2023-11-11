// models.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id:String,
  amount: String,
  account: String,
  date: String,
  comments: String,
  balance: String,
  image: String,
});
const transactionforapproved = new mongoose.Schema({
  id:String,
  amount: String,
  account: String,
  date: String,
  comments: String,
  balance: String,
  image: String,
});

const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  country: String,
  propertytype: String,
  price: String,
  image:String,
  transactions: [transactionSchema],
});

const alltransactionsSchema=new mongoose.Schema({
  id:String
  // transactions: [transactionSchema],
})

const Propertydetail = mongoose.model('Propertydetail', propertySchema);
const Transactiondetail = mongoose.model('Transactiondetail', transactionSchema);
const AlltransactionsSchema = mongoose.model('AllTransactiondetail', alltransactionsSchema);
const Transactionforapprovement = mongoose.model('transactionforapproved', transactionforapproved);
module.exports = { Propertydetail,Transactiondetail,AlltransactionsSchema,Transactionforapprovement };