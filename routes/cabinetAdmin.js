const express = require('express');
const router = express.Router();
const models = require('../models');

// GET for admin cabinet
router.get('/', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const role = req.session.userRole;
  if (id != null && login != null && role === "admin") {
    res.render('cabinetAdmin', {
      user: {
        id,
        login,
        role
      }
    });
  } else {
    res.render('cabinet/auth', {
      user: {
        id,
        login,
        role
      }
    });
  }
});

router.get('/new_recipes', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const role = req.session.userRole;

  if (id != null && login != null && role === "admin") {
    models.UncheckedRecipe.find().then(recipes => {
      res.render('cabinetAdmin/new_recipes', {
        user: {
          id,
          login,
          role
        },
        recipes
      });
    });
  } else {
    res.render('cabinet/auth', {
      user: {
        id,
        login,
        role
      }
    });
  }
});

module.exports = router;
