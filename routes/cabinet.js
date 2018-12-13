const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/add_recipe', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const role = req.session.userRole;

  if (id != null && login != null) {
    res.render('cabinet/add_recipe', {
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

//POST for Add recipe
router.post('/add_recipe', (req, res) => {
  const title = req.body.title;
  const ingredients = req.body.ingredients;
  const fullRecipe = req.body.fullRecipe;
  const author = req.session.userId;
  const photoPath = req.body.photoPath;

  console.log(req.body);
  if(!title || !ingredients || !fullRecipe) {
    const fields = [];
    if (!title) fields.push('title');
    if (!ingredients) fields.push('ingredients');
    if (!fullRecipe) fields.push('fullRecipe');

    res.json({
      ok: false,
      error: 'You must fill in all fields!',
      fields: fields
    });
  } else {
    models.UncheckedRecipe.create({
      title,
      ingredients,
      fullRecipe,
      author,
      photoPath
    }).then(unceckedRecipe => {
      console.log(unceckedRecipe);
      res.json({
        ok:true
      });
    }).catch(err => {
      console.log(err);
      res.json({
        ok:false
      });
    })
  }
});

module.exports = router;
