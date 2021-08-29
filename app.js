var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();
const PORT = 3210;

app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static files location setup
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
  res.send("Hi, Connected!")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next({
    msg: 'Not Found',
    status: 404
  });
});
// error handler
app.use(function(err, req, res, next) {
  console.log('ERROR Handling middleware in execution!!! --> ', err);

  res.json({
    msg: err.msg || err,
    status: err.status || 404
  })
  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

app.listen(PORT, (err) => {
  if(err){
    console.log(err);
    return
  }
  console.log('App listening at port: ', PORT);
})
