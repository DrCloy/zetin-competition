/* Dependencies */
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwkToPem = require('jwk-to-pem');
const createError = require('http-errors');

/* Environment Variables */
require('dotenv').config();
const { ADMIN_ID } = process.env;

/* Error handling of environment variables */
let error = false;
if ((error = !ADMIN_ID)) {
  console.error(
    '\x1b[31mThe value of ADMIN_ID environment variable is not exist or empty.',
  );
}

module.exports = async function (token) {
  if (error) throw createError(500, '관리자 환경 변수 설정이 잘못되었습니다.');
  if (!token) throw createError(401, '인증 정보가 없습니다.');

  try {
    // get public key from auth server
    const resKeys = await axios.get(
      `https://${process.env.ZETIN_AUTH_HOST || 'auth.zetin.uos.ac.kr'}/keys`,
    );

    // verify given token
    const publicKey = jwkToPem(resKeys.data[0]);
    const payload = jwt.verify(token, publicKey); // return the payload of jwt

    // verify whether the user of given token is one of the valid administrators
    const adminIDs = ADMIN_ID.split(','); // get administrator account information
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
