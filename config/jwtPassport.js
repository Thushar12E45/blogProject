const fs = require('fs');
const path = require('path');

const JwtStrategy = require('passport-jwt').Strategy;

const { ExtractJwt } = require('passport-jwt');

const pathToKey = path.join(__dirname, '/pub_key.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const { getUserById } = require('../util/queryFunctions.js');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await getUserById(+payload.sub);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, null);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
