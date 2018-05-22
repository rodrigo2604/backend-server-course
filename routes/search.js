const express = require('express');

const app = express();

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

app.get('/all/:search', (req, res) => {
  const search = req.params.search;
  const searchRegex = new RegExp(search, 'i');

  const promises = [
    Hospital.find({ name: searchRegex }),
    Doctor.find({ name: searchRegex }),
  ];

  Promise.all(promises).then(([hospitals, doctors]) =>
    res.status(200).json({
      hospitals,
      doctors,
    })
  );
  /*.catch(err =>
      res.status(500).json({
        ok: true,
        message: 'Error on search hospitals',
        errors: err,
      })
    )
    .then(hospitals =>
      res.status(200).json({
        ok: true,
        hospitals,
      })
    );*/
});

module.exports = app;
