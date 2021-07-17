const { createProxyMiddleware } = require('http-proxy-middleware');

// https://www.npmjs.com/package/http-proxy-middleware

// CORS(Cross-Origin Resource Sharing) Solution:
// https://velog.io/@neity16/React-CORS-http-proxy-middleware
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://linetracer-comp.run.goorm.io',
      changeOrigin: true,
    }),
  );
};
