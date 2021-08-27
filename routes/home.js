const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//welcome page
router.get('/', (req, res) => {
  res.render('welcome')
});
//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    name: req.user.name
    
  })
});

// router.get('/matches',  (req, res) => {
//   res.render('matches')

  
// });
  
  
  
  

module.exports = router;