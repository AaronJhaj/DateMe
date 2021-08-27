const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//loads the required dependencies and global variables needed for this module to query, update and send data to the database in order for the system to function

//brings in the required schema to create a new user file in the database, this was created in a different module called models/User.js
const User = require('../models/User') 

// allows for the system to redirect the user to different pages using a GET method to render new pages
//render login page
router.get('/login', (req, res) => res.render('login'));
//render register page
router.get('/register', (req, res) => res.render('register'));
//render dashboard page
router.get('/dashboard', (req, res) => res.render('dashboard'));
//render quiz page
router.get('/quiz', (req, res) => res.render('quiz'));

// handles the POST method sent from the matches ejs file
router.get('/matches', (req, res) => {
  var q1 =  req.user.q1
  var q2 =  req.user.q2
  var q3 =  req.user.q3
  var q4 =  req.user.q4
  var email = req.user.email
  var gender = req.user.gender
  var sexPref = req.user.sexPref
  //creates varibales to use in query to find matches
  if (gender == "male" , sexPref == "heterosexual"){
    User.find({ $and: [{ $or: [ { q1: q1 } , { q2: q2 }, { q3: q3 }, { q4: q4 } ] }, {email: { $ne: email }}, {sexPref: sexPref}, {gender: { $ne: gender } }]}, {_id: false, email: false, password: false, date: false, __v: false})
    //query the database to find a user matching certain answers by the user
    .then(matches => {
      var myArray = Array.from(matches)
      console.log(myArray)
      res.render('matches', {myArray})
    })
  }else if(gender == "male" , sexPref == "homosexual"){
      User.find({ $and: [{ $or: [ { q1: q1 } , { q2: q2 }, { q3: q3 }, { q4: q4 } ] }, {email: { $ne: email }}, {sexPref: sexPref}, {gender: gender}]}, {_id: false, email: false, password: false, date: false, __v: false})
      .then(matches => {
        var myArray = Array.from(matches)
        console.log(myArray)
        res.render('matches', {myArray})
      })
  }else if(gender == "female" , sexPref == "heterosexual"){
      User.find({ $and: [{ $or: [ { q1: q1 } , { q2: q2 }, { q3: q3 }, { q4: q4 } ] }, {email: { $ne: email }}, {sexPref: sexPref}, {gender: { $ne: gender } }]}, {_id: false, email: false, password: false, date: false, __v: false})
      .then(matches => {
        var myArray = Array.from(matches)
        console.log(myArray)
        res.render('matches', {myArray})
      })
  }else if(gender == "female" , sexPref == "homosexual"){
      User.find({ $and: [{ $or: [ { q1: q1 } , { q2: q2 }, { q3: q3 }, { q4: q4 } ] }, {email: { $ne: email }}, {sexPref: "homosexual"}, {gender: "female"}]}, {_id: false, email: false, password: false, date: false, __v: false})
      .then(matches => {
        var myArray = Array.from(matches)
        console.log(myArray)
        res.render('matches', {myArray})
      })
  }
});

//chat page
router.get('/chat', (req, res) => res.render('chat'));
//profile page
router.get('/profile', (req, res) => res.render('profile'));
//register handle
router.post('/register', (req, res) =>{
  const { name, email, password, password2 } = req.body; // creates a constant using the data parsed from the ejs web form
  let errors = []; // creates an array called errors that can be displayed to the console for developing purposes

  //check required fields for data, and pushes an error if no data is contained, this is a form of validation
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  //check passwords match
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }      

  if (errors.length > 0) {  // if errors are present within the errors array it renders them to the register.ejs file
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //if validation passed the query code below is run
    User.findOne({ email: email }) //finds users in the database that have the same email, and will push an error if they already have an account
    .then(user => {
      if(user) {
        //if a user exists in the database an error is pushed to the resgister file to alert the user
        errors.push({ msg: 'Email is already registered' })
        res.render('register', {
        errors,
        name,
        email,
        password,
        password2
        });
      } else{ //if the user does not yet exist
        const newUser = new User({ // new user is created using the imported schema from models/users.js this can then be sent to the database
          name,
          email,
          password
        })
        //hashes password before it is sent to the database 
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
          if(err) throw err;
          //set password to hashed
          newUser.password = hash;
          //save user
          newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered and can log in');
              res.redirect('/users/login')
            })
            .catch(err => console.log(err))
        }))
      }
    })
  }  
});

//login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
//personality quiz post to database
router.post('/quiz', (req, res) => {
  const email = req.user.email
  const { gender, sexPref, age, q1, q2, q3, q4 } = req.body;
  var query = { email: email };
  var newValues = { $set: {gender: gender, sexPref: sexPref, age: age, q1: q1, q2: q2, q3: q3, q4: q4}};
  User.updateOne(query, newValues)
  .then(res.redirect('/users/matches'))
})

module.exports = router;