const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');


// mongodb database
const dbURI = 'mongodb://localhost:27017/BB-F';              // db url string
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
      console.log('Database is connected!');
    })
    .catch((err, next)=>{
      console.log('Database connection error');
      next(createError(err));
    })


// getting routes
const mainRouter = require('./routes/main');
const intermediaryRouter = require('./routes/intermediary');

// express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// session configuration
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionConfig));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// flash middleware
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Routes Setting
app.use('/bluebird', mainRouter);
app.use('/bluebird/intermediary', intermediaryRouter);


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
