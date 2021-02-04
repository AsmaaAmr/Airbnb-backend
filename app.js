var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//db connection
const mongoose = require('mongoose');
var cloudURL = "mongodb+srv://kamel_elsehly:033183987@cluster0iti.lleni.mongodb.net/Airbnb-GP?retryWrites=true&w=majority";
mongoose.connect(cloudURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hostsRouter = require('./routes/hosts');
var adminsRouter = require('./routes/admins');

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hosts', hostsRouter);
app.use('/admins', adminsRouter);


const bodyParser = require('body-parser');
app.use(bodyParser.json());

usersRouter(app)
hostsRouter(app)
adminsRouter(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


