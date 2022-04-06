const router = require('express').Router();
const axios = require('axios');
const createError = require('http-errors');

router.post('/login/zetin', async (req, res, next) => {
  try {
    const { id, pw } = req.body;

    if (!id || !pw) {
      next(createError(401, 'Invalid id or pw.'));
    }

    const resZetinAuth = await axios.post('https://auth.zetin.uos.ac.kr/auth', {
      id,
      pw,
    });

    const { status, token } = resZetinAuth.data;
    if (status === 'success') {
      res.status(200).send(token);
    } else {
      next(createError(401, 'Login at the zetin server was failed.'));
    }
  } catch (err) {
    next(createError(500, err));
  }
});

module.exports = router;
