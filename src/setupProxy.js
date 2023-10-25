const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/functions/', { 
      target: 'http://localhost:8080/', 
      pathRewrite: {
          "^\\.netlify/functions": ""
      }
  }));
};


// const { env } = require('process');

// const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//   env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:23940';

// const context =  [

// ];

// module.exports = function(app) {
//   const appProxy = createProxyMiddleware(context, {
//     target: target,
//     secure: false,
//     headers: {
//       Connection: 'Keep-Alive'
//     }
//   });

//   app.use(appProxy);
// };
