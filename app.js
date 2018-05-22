const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user');
const doctorRoutes = require('./routes/doctor');
const hospitalRoutes = require('./routes/hospital');
const loginRoutes = require('./routes/login');
const searchRoutes = require('./routes/search');
const appRoutes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
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
