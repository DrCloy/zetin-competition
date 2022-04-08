const router = require('express').Router();
const axios = require('axios');
const createError = require('http-errors');

const admin = require('../../middlewares/admin')();

router.post(
  '/admin',
  // first, zetin member authentication
  async (req, res, next) => {
    try {
      const { id, pw } = req.body;
      const resLogin = await axios.post(
        // login
        'https://auth.zetin.uos.ac.kr/auth',
        {
          id,
          pw,
        },
      );

      const { status, token } = resLogin.data;
      if (status === 'success') {
        // for input of admin middleware
        req.headers['authorization'] = token;
        next();
      } else {
        next(
          createError(401, 'ZETIN Login was failed. Please check ID and PW.'),
        );
      }
    } catch (err) {
      next(createError(500, err));
    }
  },
  // second, check this member is admin. if not call 401 http error.
  admin,
  // third, if this member is admin, send authentication information.
  (req, res) => {
    res.status(200).send(req.headers['authorization']);
  },
);

module.exports = router;
