const express = require("express");
const bodyParser = require("body-parser");
const route = require("../src/routes/route");
const mongoose = require("mongoose");
const multer = require("multer");
const aws = require("aws-sdk");
const app = express();

app.use(bodyParser.json());
app.use(multer().any());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://akashmoon:akash_moon@cluster0.xvaineh.mongodb.net/project5_shoppingCart?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(3000, function () {
  console.log("Express app running on port" + 3000);
});