
var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var config = require('config');
var app = express();
var port = process.env.PORT || 3000;


// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});


// Bootstrap application settings
require('./config/express')(app);


// Bootstrap routes
require('./app/routes/admin/users')(app);
require('./app/routes/auth')(app);
require('./app/routes/api/event')(app);
require('./app/routes/api/eventType')(app);
require('./app/routes/api/user')(app);


/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */

app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");
  next();
});

app.listen(port, function() {
  console.log('Express app started on port ' + port);
});

