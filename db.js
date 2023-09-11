const mongoose = require("mongoose");
module.exports = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
    //   useCreateIndex: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(
      "mongodb+srv://mohammadikram20001:Pakstar123@cluster0.yloaacd.mongodb.net/FullStack",
      connectionParams
    );
    console.log("Connected to database");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
};