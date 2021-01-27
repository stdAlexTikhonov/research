/*global __dirname,process,require,module*/
// https://create-react-app.dev/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
'use strict';
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${process.env.HTTP_PORT}`,
      changeOrigin: true
    }));

  // Проксируем обращения к Порталу по адресу `/biportal`.
  const PortalFromUrl = process.env.PORTAL_PROXY_PATH || null;
  const PortalToUrl = process.env.PORTAL_PROXY_TARGET || null;
  if (!!PortalFromUrl && !!PortalToUrl) {
    console.debug('setupProxy',  PortalFromUrl, '->', PortalToUrl);
    app.use(
      PortalFromUrl,
      createProxyMiddleware({
        target: PortalToUrl,
        changeOrigin: true,
        pathRewrite: {
          ['^'+PortalFromUrl]: '/'
        }
      }));
  }
};
