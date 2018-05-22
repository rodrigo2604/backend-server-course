const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');

const app = express();

const User = require('../models/user');

app.get('/', (req, res) => {
  const offset = Number(req.query.offset) || 0;

  User.find({}, 'name email img role')
    .skip(offset)
    .limit(5)
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error on load users',
          errors: err,
        });
      }

      User.count({}, (err, count) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error on load users',
            errors: err,
          });
        }

        return res.status(200).json({
          ok: true,
          count,
          users,
        });
      });
    });
});

app.post('/', mdAuth.checkToken, (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);

  const user = new User(req.body);

  user.save((err, savedUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error on create users',
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      savedUser,
      createdBy: req.tokenUser,
    });
  });
});

app.put('/:id', mdAuth.checkToken, (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error on find users',
        errors: err,
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        mensaje: `User with id: ${id}, does not exist`,
        errors: { message: `User with id: ${id}, does not exist` },
      });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    user.save((err, savedUser) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error on update user',
          errors: err,
        });
      }

      savedUser.password = 'XD';

      res.status(200).json({
        ok: true,
        user: savedUser,
      });
    });
  });
});

app.delete('/:id', mdAuth.checkToken, (req, res) => {
  const { id } = req.params;

  User.findOneAndRemove(id, (err, removedUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error on delete user',
        errors: err,
      });
    }

    if (!removedUser) {
      return res.status(400).json({
        ok: false,
        mensaje: `User with id: ${id}, does not exist`,
        errors: { message: `User with id: ${id}, does not exist` },
      });
    }

    res.status(200).json({
      ok: true,
      user: removedUser,
    });
  });
});

module.exports = app;
