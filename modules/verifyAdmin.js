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

/* export verifyAdmin module */
if (error) {
  module.exports = function () {
    throw createError(500, '관리자 환경 변수 설정이 잘못되었습니다.');
  };
} else {
  const publicKey = fs.readFileSync(ADMIN_AUTH_PUBLIC_PEM); // get public key from environment variable
  const adminIDs = ADMIN_ID.split(' '); // get administrator account information

  module.exports = function (token) {
    if (!token) {
      throw createError(401, '인증 정보가 없습니다.');
    }

    try {
      // verify given token
      const payload = jwt.verify(token, publicKey); // return the payload of jwt

      // verify whether the user of given token is one of the valid administrators
      if (adminIDs.indexOf(payload.username) > -1) {
        return payload;
      } else {
        throw createError(401, '해당 계정은 관리자가 아닙니다.');
      }
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw createError(401, 'JWT가 만료됐습니다.');
      } else if (err instanceof jwt.NotBeforeError) {
        throw createError(401, 'JWT가 활성화돼있지 않습니다.');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw createError(401, 'JWT 검증에 실패했습니다.');
      } else {
        throw err;
      }
    }
  };
}
