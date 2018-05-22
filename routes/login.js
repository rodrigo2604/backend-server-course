const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SEED } = require('../config/config');

const app = express();

const User = require('../models/user');

app.post('/', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, dbUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error on find user by email',
        errors: err,
      });
    }

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Incorrect credentials',
        errors: err,
      });
    }

    if (!bcrypt.compareSync(password, dbUser.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Incorrect credentials',
        errors: err,
      });
    }

    dbUser.password = 'XD';

    // Create JWT
    const token = jwt.sign({ user: dbUser }, SEED, {
      expiresIn: 14400,
    });

    res.status(200).json({
      ok: true,
      user: dbUser,
      token,
      id: dbUser._id,
    });
  });
});

module.exports = app;
