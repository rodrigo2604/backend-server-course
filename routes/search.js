const express = require('express');

const app = express();

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

app.get('/all/:search', (req, res) => {
  const search = req.params.search;
  const searchRegex = new RegExp(search, 'i');

  const promises = [
    Hospital.find({ name: searchRegex }),
    Doctor.find({ name: searchRegex }),
    User.find({ name: searchRegex }),
  ];

  Promise.all(promises)
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on global search',
        errors: err,
      })
    )
    .then(([hospitals, doctors, users]) =>
      res.status(200).json({
        hospitals,
        doctors,
        users,
      })
    );
});

module.exports = app;
