const express = require('express');

const mdAuth = require('../middlewares/auth');

const app = express();

const Hospital = require('../models/hospital');

app.get('/', (req, res) => {
  const offset = Number(req.query.offset) || 0;
  let hospitals;

  Hospital.find({})
    .populate('user', 'name email')
    .skip(offset)
    .limit(5)
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on load hospitals',
        errors: err,
      })
    )
    .then(retrievedHospitals => {
      hospitals = retrievedHospitals;

      return Hospital.count({});
    })
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on counting hospitals',
        errors: err,
      })
    )
    .then(count =>
      res.status(200).json({
        ok: true,
        count,
        hospitals,
      })
    );
});

app.post('/', mdAuth.checkToken, (req, res) => {
  const hospital = new Hospital(req.body);

  hospital.user = req.tokenUser._id;

  hospital
    .save()
    .then(savedHospital =>
      res.status(201).json({
        ok: true,
        savedHospital,
      })
    )
    .catch(err =>
      res.status(400).json({
        ok: false,
        mensaje: 'Error on create hospital',
        errors: err,
      })
    );
});

app.put('/:id', mdAuth.checkToken, (req, res) => {
  const { id } = req.params;

  Hospital.findById(req.params.id)
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on find hospitals',
        errors: err,
      })
    )
    .then(hospital => {
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: `User with id: ${id}, does not exist`,
          errors: { message: `User with id: ${id}, does not exist` },
        });
      }

      hospital.name = req.body.name;
      hospital.user = req.tokenUser._id;

      return hospital.save();
    })
    .catch(err =>
      res.status(400).json({
        ok: false,
        message: 'Error on update user',
        errors: err,
      })
    )
    .then(updatedHospital =>
      res.status(200).json({
        ok: true,
        hospital: updatedHospital,
      })
    );
});

app.delete('/:id', mdAuth.checkToken, (req, res) => {
  const { id } = req.params;

  Hospital.findOneAndRemove(id)
    .then(removedHospital => {
      if (!removedHospital) {
        return res.status(400).json({
          ok: false,
          mensaje: `Hospital with id: ${id}, does not exist`,
          errors: { message: `Hospital with id: ${id}, does not exist` },
        });
      }

      return res.status(200).json({
        ok: true,
        removedHospital,
      });
    })
    .catch(err =>
      res.status(500).json({
        ok: false,
        mensaje: 'Error on delete hospital',
        errors: err,
      })
    );
});

module.exports = app;
