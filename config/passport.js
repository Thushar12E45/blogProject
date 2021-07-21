const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


const { getUserByEmail } = require('../util/queryFunctions.js');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      // Check  user
      const user = await getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: ' That email is not registered' });
      }

      // Match the Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: ' Incorrect Password ' });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    const newUser = await getUserByEmail(user.email);
    return done(null, newUser);
  });
};
