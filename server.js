const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes')); // imports ./routes/index.js

// tells Mongoose which database we want to connect to
// MONGODB_URI is how we will eventually connect via Heroku
// What happens if Mongoose connects to a database that isn't there? No worries—MongoDB will find and connect to the database if it exists or create the database if it doesn't.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
// a set of configuration options Mongoose asks for more information about.
mongoose.set('debug', true); 

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
