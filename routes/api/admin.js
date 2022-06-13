/* Dependencies */
const router = require('express').Router();
const axios = require('axios');
const createError = require('http-errors');

/* Modules */
const verifyAdmin = require('../../modules/verifyAdmin');

/* Constants */
const AUTH_URL = `https://${
  process.env.ZETIN_AUTH_HOST || 'auth.zetin.uos.ac.kr'
}/auth`;

const COOKIE_NAME = 'adminToken';
const COOKIE_PATH = '/api';

router.get('/status', async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    const payload = await verifyAdmin(token);

    res.send(payload); // send only payload, not with token
  } catch (err) {
    next(err);
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    // first, zetin member authentication
    const { id, pw } = req.body;
    const resLogin = await axios.post(AUTH_URL, {
      id,
      pw,
    });

    const { status, token } = resLogin.data;
    if (status !== 'success') {
      throw createError(
        401,
        'ZETIN 로그인에 실패했습니다. 아이디와 비밀번호를 다시 확인해주십시오.',
      );
    }

    // second, check the member is admin.
    const payload = await verifyAdmin(token);

    // third, if the member is admin, cookie the jwt.
    res
      .cookie(COOKIE_NAME, token, { httpOnly: true, path: COOKIE_PATH })
      .send(payload); // send only payload, not with token
  } catch (err) {
    next(err);
  }
});

router.post('/signout', (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, { path: COOKIE_PATH });
    res.send({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
