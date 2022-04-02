/* Dependencies */
const fs = require('fs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

/* Environments */
require('dotenv').config();
const { ADMIN_AUTH_PUBLIC_PEM, ADMIN_ID } = process.env;

/* admin Middleware */
function admin() {
  // error Handling
  const envErrorMW = (req, res, next) => {
    next(createError(500, 'Internal admin environment setting error.'));
  };

  if (!fs.existsSync(ADMIN_AUTH_PUBLIC_PEM)) {
    console.error(
      '\x1b[31mThe value of ADMIN_AUTH_PUBLIC_PEM in .env is invalid or non-existing path.',
    );
    return envErrorMW;
  }

  if (!ADMIN_ID) {
    console.error(
      '\x1b[31mThe value of ADMIN_ID in .env is not exist or empty.',
    );
    return envErrorMW;
  }

  // environments
  const PUBLIC_KEY = fs.readFileSync(ADMIN_AUTH_PUBLIC_PEM); // get public key from .env file
  const ADMINS = ADMIN_ID.split(' '); // get administrator account information

  // return admin authentication middleware
  return (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
      token = token.replace(/^Bearer\s+/, '');

      try {
        // verify given token.
        const { username } = jwt.verify(token, PUBLIC_KEY); // return the payload of jwt.

        // verify whether the user of given token is one of the valid administrators.
        if (ADMINS.indexOf(username) > -1) {
          next();
        }
      } catch (err) {
        // If verification is failed, throw an error.
        next(createError(401, err));
      }
    } else {
      next(createError(401, 'Authentication information was not found.'));
    }
  };
}

module.exports = admin;
