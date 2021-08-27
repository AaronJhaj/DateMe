const express = require('express');
//const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//user model

const app = express();

//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
    
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyParser
app.use(express.urlencoded({ extended: false }))

//express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//paspport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//app.get('/', (req, res) => {
  //res.sendFile('public/index.html');
//});

app.listen(3000, () => console.log('server started'));
