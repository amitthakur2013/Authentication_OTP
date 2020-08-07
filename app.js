const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport=require('passport');
const session=require('express-session');
const mongoose=require('mongoose');
const User = require('./models/user');

mongoose.set('useFindAndModify',false);
mongoose.set('useNewUrlParser',true);
require('dotenv').config();
mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// connect to the database
mongoose.connect('mongodb://localhost:27017/otp_data').then((db) => {
	console.log("Connected curently to server!");
}).catch((err)=>{
	console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure passport and sessions
app.use(session({
	secret:'hello dude!',
	resave:false,
	saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  // continue on to next function in middleware chain
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
