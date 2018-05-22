const express = require('express');

const mdAuth = require('../middlewares/auth');

const app = express();

const Doctor = require('../models/doctor');

app.get('/', (req, res) => {
  const offset = Number(req.query.offset) || 0;
  let doctors;

  Doctor.find({})
    .populate('user', 'name email')
    .populate('hospital')
    .skip(offset)
    .limit(5)
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on load doctors',
        errors: err,
      })
    )
    .then(retrievedDoctors => {
      doctors = retrievedDoctors;

      return Doctor.count({});
    })
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on counting doctors',
        errors: err,
      })
    )
    .then(count =>
      res.status(200).json({
        ok: true,
        count,
        doctors,
      })
    );
});

app.post('/', mdAuth.checkToken, (req, res) => {
  const doctor = new Doctor(req.body);

  // Hospital comes from client selection
  doctor.user = req.tokenUser._id;

  doctor
    .save()
    .then(savedDoctor =>
      res.status(201).json({
        ok: true,
        savedDoctor,
      })
    )
    .catch(err =>
      res.status(400).json({
        ok: false,
        mensaje: 'Error on create doctor',
        errors: err,
      })
    );
});

app.put('/:id', mdAuth.checkToken, (req, res) => {
  const { id } = req.params;

  Doctor.findById(req.params.id)
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on find doctors',
        errors: err,
      })
    )
    .then(doctor => {
      if (!doctor) {
        return res.status(400).json({
          ok: false,
          mensaje: `Doctor with id: ${id}, does not exist`,
          errors: { message: `Doctor with id: ${id}, does not exist` },
        });
      }

      doctor.name = req.body.name;
      doctor.hospital = req.body.hospital;
      doctor.user = req.tokenUser._id;

      return doctor.save();
    })
    .catch(err =>
      res.status(400).json({
        ok: false,
        message: 'Error on update doctor',
        errors: err,
      })
    )
    .then(updatedDoctor =>
      res.status(200).json({
        ok: true,
        doctor: updatedDoctor,
      })
    );
});

app.delete('/:id', mdAuth.checkToken, (req, res) => {
  const { id } = req.params;

  Doctor.findOneAndRemove(id)
    .then(removedDoctor => {
      if (!removedDoctor) {
        return res.status(400).json({
          ok: false,
          mensaje: `Doctor with id: ${id}, does not exist`,
          errors: { message: `Doctor with id: ${id}, does not exist` },
        });
      }

      return res.status(200).json({
        ok: true,
        removedDoctor,
      });
    })
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on delete doctor',
        errors: err,
      })
    );
});

module.exports = app;
