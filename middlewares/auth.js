const jwt = require('jsonwebtoken');

const { SEED } = require('../config/config');

module.exports.checkToken = (req, res, next) => {
  const { token } = req.query;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Invalid JWT',
        errors: err,
      });
    }

    req.tokenUser = decoded.user;

    next();
  });
};
