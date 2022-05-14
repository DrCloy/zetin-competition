/* Dependencies */
const fs = require('fs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

/* Environment Variables */
require('dotenv').config();
const { ADMIN_AUTH_PUBLIC_PEM, ADMIN_ID } = process.env;

/* admin Middleware */
function admin() {
  // error handling middleware
  const envErrorMW = (req, res, next) => {
    next(createError(500, '관리자 환경 변수 설정이 잘못되었습니다.'));
  };

  if (!fs.existsSync(ADMIN_AUTH_PUBLIC_PEM)) {
    console.error(
      '\x1b[31mThe value of ADMIN_AUTH_PUBLIC_PEM environment variable is invalid or non-existing path.',
    );
    return envErrorMW;
  }

  if (!ADMIN_ID) {
    console.error(
      '\x1b[31mThe value of ADMIN_ID environment variable is not exist or empty.',
    );
    return envErrorMW;
  }

  const publicKey = fs.readFileSync(ADMIN_AUTH_PUBLIC_PEM); // get public key from environment variable
  const adminIDs = ADMIN_ID.split(' '); // get administrator account information

  // return admin authentication middleware
  return (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
      next(createError(401, '인증 정보가 없습니다.'));
    }

    try {
      token = token.replace(/^Bearer\s+/, '');

      // verify given token.
      const { username } = jwt.verify(token, publicKey); // return the payload of jwt.

      // verify whether the user of given token is one of the valid administrators.
      if (adminIDs.indexOf(username) > -1) {
        next();
      } else {
        next(createError(401, '해당 계정은 관리자가 아닙니다.'));
      }
    } catch (err) {
      // If verification is failed, throw an error.
      next(createError(401, err));
    }
  };
}

module.exports = admin;
