// all the different route files are linked here.
// route file News CRUD where mysql has been used
const newsRoutes = require('./news_routes');

// route file for News CRUD where firebase has been integrated
//const newsRoutes = require('./news');
const commentsRoutes = require('./comments');
const tagsRoutes = require('./tags');
module.exports = function(app, db) {
  newsRoutes(app, db);
  commentsRoutes(app,db);
  tagsRoutes(app,db);
  // Other route groups could go here, in the future
};