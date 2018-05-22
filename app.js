const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connection.openUri(
  'mongodb://localhost:27017/hospitalDB',
  (err, res) => {
    if (err) throw err;

    console.log('MongoDB database online!');
  }
);

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Success request',
  });
});

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
