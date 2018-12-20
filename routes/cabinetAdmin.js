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
// GET for new recipes page
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

//POST for Accepting recipe
router.post('/accept', (req, res) => {
  const recipe_id = req.body.id.trim();
  const title = req.body.title.trim();
  const ingredients = req.body.ingredients.trim();
  const fullRecipe = req.body.fullRecipe.trim();
  const photoPath = req.body.photoPath.replace("http://localhost:3000", "");
  const author = req.body.author.trim();
  if(!title || !ingredients || !fullRecipe || !photoPath || !recipe_id || !author) {
    res.json({
      ok: false,
      error: 'All recipes fields must be filled!'
    });
  } else {
    models.CheckedRecipe.create({
      title,
      ingredients,
      fullRecipe,
      author,
      photoPath
    }).then(() => {
      models.UncheckedRecipe.findByIdAndDelete(recipe_id, function(err, doc) {
        if(err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    }).then(() => {
      res.json({
        ok:true
      });
    }).catch(err => {
      console.log(err);
      res.json({
        ok:false
      });
    });
  }
});
module.exports = router;
