// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  legalName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  idOrPassport: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  // Add fields for bank account and crypto wallet data
  bankAccount: {
    accountNumber: String,
    routingNumber: String,
    accountHolderName: String,
  },
  cryptoWallet: {
    walletAddress: String,
  },
});

module.exports = mongoose.model('Verification', userSchema);
