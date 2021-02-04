/*global __dirname,process,require,module*/
// https://create-react-app.dev/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
'use strict';
const { createProxyMiddleware } = require('http-proxy-middleware');

// Перенаправление запросов API.
// See also `portalProxy` in `./server/portal.js`.
module.exports = function (app)
{
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${process.env.HTTP_PORT}`,
      changeOrigin: true
    }));
};
