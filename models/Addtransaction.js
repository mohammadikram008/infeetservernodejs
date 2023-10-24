const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  amount: {
    type: String,
    required: false,
  },
  account: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  comments: {
    type: String,
    required: false,
  },
  balance: {
    type: String,
    required: false,
  },
  image:{
    type: String,
    required: false,
  }
 
});
module.exports = mongoose.model("addtransaction", taskSchema);