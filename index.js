console.log('Step 1: Requiring express module');
const express = require('express');

console.log('Step 2: Requiring cors module');
var cors = require('cors');
const connection = require('./connection');
console.log('Step 3: Creating an instance of express');
const app = express();
const userRoute = require('./routes/user');




console.log('Step 4: Using cors middleware to enable CORS');
app.use(cors());

console.log('Step 5: Using express.urlencoded middleware to parse URL-encoded bodies');
app.use(express.urlencoded({ extended: true }));

console.log('Step 6: Using express.json middleware to parse JSON bodies');
app.use(express.json());
app.use('/user', userRoute);


module.exports = app; 