/* Dependencies */
const createError = require('http-errors');

/* Modules */
const verifyAdmin = require('../modules/verifyAdmin');

/* function that create admin Middleware */
function admin(options) {
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
      verifyAdmin(token);
      req.isAdmin = true;
      next();
    } catch (err) {
      if (!options.adminOnly) {
        req.isAdmin = false;
        return next();
      }
      next(err);
    }
  };
}

module.exports = admin;
