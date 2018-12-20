const express = require('express');
const router = express.Router();
const models = require('../models');

// GET for all recipes cabinet
router.get('/', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const role = req.session.userRole;
  models.CheckedRecipe.find().then(recipes => {
    console.log("It is working: " + recipes);
    res.render('index', {
      user: {
        id,
        login,
        role
      },
      recipes
    });
  });
});
module.exports = router;
