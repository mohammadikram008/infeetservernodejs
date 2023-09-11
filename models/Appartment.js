const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  appartmentaddres: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },
  image:{
    type: String,
    required: false,
  }
 
});
module.exports = mongoose.model("appartmentdetail", taskSchema);