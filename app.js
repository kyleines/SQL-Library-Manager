/************************************************
Treehouse FSJS Techdegree:
Project 8 - SQL Library Manager
************************************************/

/*
Dear Reviewer,
I appreciate you for taking the time to review my project! 
Your feedback is important to me and crucial to my growth as a developer.
With the following code I hope to earn the "Exceeds Expectations" grade, and 
I humbly request that you reject my submission if I don't meet those requirements.

Thank you again!
-Kyle
*/

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// Sync and Test server connection
const db = require('./models/index');
(async () => {
  await db.sequelize.sync();
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  const error = new Error();
  error.status = 404;
  error.message = 'Page Not Found';

  res.render('page-not-found', {error});
});

// error handler
app.use(function(err, req, res, next) {
  err.status = 500;
  err.message = "Something went wrong";
  console.log(err.status, err.message);

  res.render('error', {err});
});

module.exports = app;
