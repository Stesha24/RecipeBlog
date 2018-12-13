const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');

//POST is registration
router.post('/registration', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const role = "user";

  if(!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    if (!passwordConfirm) fields.push('passwordConfirm');
    res.json({
      ok: false,
      error: 'You must fill in all fields!',
      fields: fields
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Only Latin letters or numbers!',
      fields: ['login']
    });
  } else if (login.length < 5 || login.length > 20) {
    res.json({
      ok: false,
      error: 'Login must be between 5 and 20!',
      fields: ['login']
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'Password must be 5 or more symbols!',
      fields: ['password']
    });
  }
  else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Passwords do not match!',
      fields: ['password', 'passwordConfirm']
    });
  } else {
    bcrypt.hash(password, null, null, (err, hash) => {
      models.User.create({
        login,
        password: hash,
        role
      }).then(user => {
        req.session.userId = user.id;
        req.session.userLogin = user.login;
        req.session.userRole = user.role;
        res.json({
          ok: true
        });
      }).catch(err => {
        console.log(err);
        res.json({
          ok: false,
          error: 'Try again later!'
        });
      });
    });
  }
});

//POST is authorization
router.post('/authorization', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  console.log(req.body);
  if(!login || !password) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    res.json({
      ok: false,
      error: 'You must fill in all fields!',
      fields: fields
    });
  } else {
    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        res.json({
          ok: false,
          error: 'Login and password incorrect!',
          fields: ['login', 'password']
        });
      } else {
        bcrypt.compare(password, user.password, function(err, result){
          if(!result) {
            res.json({
              ok: false,
              error: 'Login and password incorrect!',
              fields: ['login', 'password']
            });
          } else {
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            req.session.userRole = user.role;
            res.json({
              ok: true
            });
          }
        });
      }
    }).catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: 'Try again later!'
      });
    });
  }
});

// GET Log out
router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});
module.exports = router;
