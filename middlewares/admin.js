/* Dependencies */
const fs = require('fs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

/* Environment Variables */
require('dotenv').config();
const { ADMIN_AUTH_PUBLIC_PEM, ADMIN_ID } = process.env;

/* Error handling of environment variables */
let error = false;
if ((error = !fs.existsSync(ADMIN_AUTH_PUBLIC_PEM))) {
  console.error(
    '\x1b[31mThe value of ADMIN_AUTH_PUBLIC_PEM environment variable is invalid or non-existing path.',
  );
}
if ((error = !ADMIN_ID)) {
  console.error(
    '\x1b[31mThe value of ADMIN_ID environment variable is not exist or empty.',
  );
}

/* function that create admin Middleware */
function admin(options) {
  if (error) {
    // return error handling middleware
    return (req, res, next) =>
      next(createError(500, '관리자 환경 변수 설정이 잘못되었습니다.'));
  }

  const publicKey = fs.readFileSync(ADMIN_AUTH_PUBLIC_PEM); // get public key from environment variable
  const adminIDs = ADMIN_ID.split(' '); // get administrator account information
  options = { adminOnly: true, ...options };

  // return admin authentication middleware
  return (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if (!token) {
        throw createError(401, '인증 정보가 없습니다.');
      }
      token = token.replace(/^Bearer\s+/, '');

      // verify given token.
      const { username } = jwt.verify(token, publicKey); // return the payload of jwt.

      // verify whether the user of given token is one of the valid administrators.
      if (adminIDs.indexOf(username) > -1) {
        req.isAdmin = true;
        next();
      } else {
        throw createError(401, '해당 계정은 관리자가 아닙니다.');
      }
    } catch (err) {
      if (!options.adminOnly) {
        req.isAdmin = false;
        return next();
      }

      if (err instanceof jwt.JsonWebTokenError) {
        next(createError(401, 'JWT 검증에 실패했습니다.'));
      } else if (err instanceof jwt.TokenExpiredError) {
        next(createError(401, 'JWT가 만료됐습니다.'));
      } else if (err instanceof jwt.NotBeforeError) {
        next(createError(401, 'JWT가 활성화돼있지 않습니다.'));
      } else {
        next(err);
      }
    }
  };
}

module.exports = admin;
