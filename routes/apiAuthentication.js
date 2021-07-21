const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const logger = require('../util/winstonLogger');
const issueJWT = require('../util/issueJwt');

const { getUserByEmail, createData } = require('../util/queryFunctions.js');

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
    res.status(406).json(errors);
  } else {
    const user = await getUserByEmail(email);

    if (user) {
      errors.push({ msg: 'Email is already registerd' });
      res.status(406).json(errors);
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

          const jwt = issueJWT(newUser);
          res.json({ success: true, user: newUser, token: jwt.token, expiresIn: jwt.expiresIn });
        })
      );
    }
  }
});

router.post('/login', async (req, res) => {
  const user = await getUserByEmail(req.body.email);

  if (!user) {
    res.status(401).json({ success: false, msg: 'The email is not registered' });
  } else {
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        throw err;
      } else if (isMatch) {
        const jwt = issueJWT(user);
        res.json({ success: true, user, token: jwt.token, expiresIn: jwt.expiresIn });
      } else {
        res.status(401).json({ success: false, msg: 'You entered the wrong password' });
      }
    });
  }
});

module.exports = router;
