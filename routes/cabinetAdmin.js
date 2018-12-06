const express = require('express');
const router = express.Router();
const models = require('../models');

// GET for admin cabinet
router.get('/', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const role = req.session.role;
  if (id != null && login != null && role === "admin") {
    res.render('cabinetAdmin', {
      user: {
        id,
        login
      }
    });
  } else {
    res.render('cabinet/auth', {
      user: {
        id,
        login
      }
    });
  }
});

module.exports = router;
