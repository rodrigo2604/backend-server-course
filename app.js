const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const appRoutes = require('./routes');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

mongoose.connection.openUri(
  'mongodb://localhost:27017/hospitalDB',
  (err, res) => {
    if (err) throw err;

    console.log('MongoDB database online!');
  }
);

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
