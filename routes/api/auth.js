/* Dependencies */
const router = require('express').Router();
const axios = require('axios');
const createError = require('http-errors');

/* Middlewares */
const admin = require('../../middlewares/admin')();

/* Constants */
const AUTH_HOST =
  process.env.ZETIN_AUTH_HOST || 'https://auth.zetin.uos.ac.kr/auth';

router.post(
  '/admin',
  // first, zetin member authentication
  async (req, res, next) => {
    try {
      const { id, pw } = req.body;
      const resLogin = await axios.post(AUTH_HOST, {
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

      // Manipulate authorization request header for admin middleware
      req.headers.authorization = token;
      next();
    } catch (err) {
      next(err);
    }
  },
  // second, check this member is admin. if not call 401 http error.
  admin,
  // third, if this member is admin, send authentication information.
  (req, res) => {
    res.status(200).send(req.headers.authorization);
  },
);

module.exports = router;
