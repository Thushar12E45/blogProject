const fs = require('fs');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');

const pathToKey = path.join(__dirname, '../config/priv_key.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

function issueJWT(user) {
  const { id } = user;

  const expiresIn = '2d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
}

module.exports = issueJWT;
