var express = require('express');
var path = require('path');
var app = express();
const PORT = 3210;
const cookieParser = require('cookie-parser');

// Load main router
const mainRouter = require('./routes/main.routes')

// Dev Tool
var logger = require('morgan');
app.use(logger('dev'));

// view engine setup
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// user cookie parser 
app.use(cookieParser());

//serve static files
app.use(express.static('public'));

// Main Router
app.use('/', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next({
    msg: 'Page not found',
    status: 404
  });
});
// error handler middleware
app.use(function(err, req, res, next) {
  console.log('ERROR Handling middleware in execution!!! --> ', err);

  // res.status(err.status || 500);
  // res.json({
  //   msg: err.msg || err,
  //   status: err.status || 404
  // })

  // render the error page
  res.render('./pages/error', {
    msg: err.msg || err
  });
});

app.listen(PORT, (err) => {
  if(err){
    console.log(err);
    return
  }
  console.log('App listening at port: ', PORT);
})
