const express = require('express');
const mongoose = require('mongoose');

const app = express();

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

app.get('/all/:search', (req, res) => {
  const search = req.params.search;
  const searchRegex = new RegExp(search, 'i');

  const promises = [
    queries.hospitals(searchRegex),
    queries.doctors(searchRegex),
    queries.users(searchRegex),
  ];

  Promise.all(promises)
    .catch(err => {
      res.status(500).json({
        ok: false,
        mensaje: 'Error on global search',
        errors: err,
      });
    })
    .then(([hospitals, doctors, users]) =>
      res.status(200).json({
        hospitals,
        doctors,
        users,
      })
    );
});

app.get('/collection/:table/:search', (req, res) => {
  const { table, search } = req.params;
  const searchRegex = new RegExp(search, 'i');

  getQueryFromTable(table)
    .catch(err => {
      res.status(400).json({
        ok: false,
        mensaje: 'Error on search on one collection',
        errors: err,
      });
    })
    .then(query => {
      return query(searchRegex);
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        mensaje: 'Error on global search',
        errors: err,
      });
    })
    .then(result =>
      res.status(200).json({
        [table]: result,
      })
    );
});

function getQueryFromTable(table) {
  const foundQuery = Object.keys(queries)
    .filter(collection => collection === table)
    .map(collection => queries[collection])[0];

  return new Promise((resolve, reject) => {
    foundQuery ? resolve(foundQuery) : reject('Model not found');
  });
}

const queries = {
  users: searchRegex =>
    User.find({}, 'name email role')
      .or([{ name: searchRegex, email: searchRegex }])
      .exec(),
  hospitals: searchRegex =>
    Hospital.find({ name: searchRegex })
      .populate('user', 'name email')
      .exec(),
  doctors: searchRegex =>
    User.find({}, 'name email role')
      .or([{ name: searchRegex, email: searchRegex }])
      .exec(),
};

module.exports = app;
