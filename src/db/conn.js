// const mongoose= require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/Registration", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log(`Connection Successful`);
// }).catch((e) => {
//   console.error(`Connection Error: ${e.message}`);
// });

const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://usman:EUudAItfmXPRjyKT@cluster0.9u9jldk.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connection Successful`);
}).catch((e) => {
  console.error(`Connection Error: ${e.message}`);
});
