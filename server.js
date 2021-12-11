const express = require("express");
const cors = require("cors");
var mongoose = require('mongoose');

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
var usersRouter = require('./userprofile/user_route');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//DB config
const dB = 'mongodb+srv://admin:mak123@e-receipt-cluster.au4u7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dB, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connect(dB, { useNewUrlParser: true, useUnifiedTopology: true });
connection.then((db) => {
    console.log("Connected correctly to server");

}, (err) => { console.log(err); });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to E application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
