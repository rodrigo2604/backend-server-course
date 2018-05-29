const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');

const app = express();

app.use(fileUpload());

app.put('/:type/:id', (req, res) => {
  const { type, id } = req.params;

  const validTypes = ['hospitals', 'doctors', 'users'];

  if (!validTypes.includes(type)) {
    res.status(400).json({
      ok: false,
      mensaje: 'No files selected',
      errors: {
        message: `Valids types are ${validTypes.join(', ')}`,
      },
    });
  }

  if (!req.files && !req.files.img) {
    res.status(400).json({
      ok: false,
      mensaje: 'No files selected',
      errors: {
        message: 'You must select an image on img property',
      },
    });
  }

  const file = req.files.img;
  const splittedName = file.name.split('.');
  const ext = splittedName[splittedName.length - 1];

  // Just theese extensions
  const validExts = ['png', 'jpg', 'gif', 'jpeg'];

  if (!validExts.includes(ext)) {
    res.status(400).json({
      ok: false,
      mensaje: 'No valid extension',
      errors: {
        message: `Valids extensions are ${validExts.join(', ')}`,
      },
    });
  }

  const fileName = `${id}-${new Date().getMilliseconds()}.${ext}`;
  const path = `./uploads/${type}/${fileName}`;

  file.mv(path, err => {
    if (err) {
      res.status(400).json({
        ok: false,
        mensaje: 'Error on move file',
        errors: err,
      });
    } else {
      uploadByType(type, id, fileName, res);

      /*res.status(200).json({
        ok: true,
        message: 'File moved',
        ext,
      });*/
    }
  });
});

function uploadByType(type, id, fileName, res) {
  if (type === 'users') {
    User.findById(id)
      .then(user => {
        const oldPath = `./uploads/users/${user.img}`;
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath);
        }
        user.img = fileName;

        return user.save();
      })
      .then(updatedUser => {
        updatedUser.password = 'XD';
        return res.status(200).json({
          ok: true,
          message: 'User image updated',
          user: updatedUser,
        });
      });
  }

  if (type === 'doctors') {
    Doctor.findById(id)
      .then(doctor => {
        const oldPath = `./uploads/doctors/${doctor.img}`;
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath);
        }
        doctor.img = fileName;

        return doctor.save();
      })
      .then(updatedDoctor => {
        return res.status(200).json({
          ok: true,
          message: 'Doctor image updated',
          doctor: updatedDoctor,
        });
      });
  }

  if (type === 'hospitals') {
    Hospital.findById(id)
      .then(hospital => {
        const oldPath = `./uploads/hospitals/${hospital.img}`;
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath);
        }
        hospital.img = fileName;

        return hospital.save();
      })
      .then(updatedHospital => {
        return res.status(200).json({
          ok: true,
          message: 'Hospital image updated',
          hospital: updatedHospital,
        });
      });
  }
}

module.exports = app;
