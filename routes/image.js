const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/:type/:img', (req, res) => {
  const { type, img } = req.params;
  const imagePath = path.resolve(__dirname, `../uploads/${type}/${img}`);

  fs.existsSync(imagePath)
    ? res.sendFile(imagePath)
    : res.sendFile(path.resolve(__dirname, '../assets/no-img.jpg'));
});

module.exports = app;
