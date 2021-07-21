const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const logger = require('../util/winstonLogger');
const { getUserByEmail, createData } = require('../util/queryFunctions.js');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', check('email', 'Your email is not valid').isEmail(), async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const errors = [];

  const emailValidation = validationResult(req);

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ msg: ' Please fill in all the fields' });
  }
  if (!emailValidation.isEmpty()) {
    errors.push({ msg: emailValidation.errors[0].msg });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password length should be atleast 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  } else {
    const user = await getUserByEmail(email);

    if (user) {
      errors.push({ msg: 'Email is already registerd' });
      res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    } else {
      let newUser = {
        name,
        email,
        password,
      };
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          newUser = await createData(newUser, 'userTable');

          req.flash('successMessage', ' You are now Registered and can login');
          res.redirect('/user/login');
        })
      );
    }
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/user/login',
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  global.isLogged = false;
  req.logout();
  res.redirect('/');
});

module.exports = router;
