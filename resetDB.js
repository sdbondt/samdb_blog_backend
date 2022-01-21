require("dotenv").config();
const User = require("./models/User");
const connectToDB = require("./db");
const Post = require('./models/Post')
connectToDB(process.env.MONGO_URI);

const deleteAll = async () => {
  try {
    console.log("Delete everything.");
    await User.deleteMany({});
    await Post.deleteMany({})
  } catch (e) {
    console.log(e);
  }
};

deleteAll();