/* eslint-disable */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const upload = require('express-fileupload');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const { logger } = require('./util/winstonLogger.js');

const app = express();
const PORT = process.env.PORT || 8000;

require('./config/passport')(passport);

require('./config/jwtPassport')(passport);

app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(upload());

app.use(methodOverride('_method'));

// Global vars
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.warningMessage = req.flash('warningMessage');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use(express.static(`${__dirname}/public`));
app.use('/', require('./routes/article.js'));
app.use('/user', require('./routes/authentication.js'));
app.use('/user', require('./routes/user.js'));
app.use('/api', require('./routes/apiAuthentication.js'));
app.use('/api', require('./routes/api.js'));

app.listen(PORT, console.log(`Listening at port http://localhost:${PORT}`));


