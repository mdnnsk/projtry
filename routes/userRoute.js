var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require ('../models/user');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in ', req.user);
    res.send(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    // res.send(false);
    console.log('not logged in');
    res.redirect(301, '/');
    // res.send(false);
  }
});

router.post('/', function(req, res){

  console.log('updating locations');
  user.findOne({username: req.body.user}, function (err, userResult){
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }else{
      user.update({
        destLoc:req.body.locations[1],
        homeLoc:req.body.locations[0]
      }, function(err) {});
      res.sendStatus(200);
    }
  });
});

router.post('/updateDate', function(req, res){

  console.log('updating date');
  user.findOne({username: req.body.user}, function (err, userResult){
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }else{
      user.update({
        trackDate:req.body.trackDate
      }, function(err) {});
      res.sendStatus(200);
    }
  });
});

router.post('/updatePrice', function(req, res){

  console.log('updating notification price');
  user.findOne({username: req.body.user}, function (err, userResult){
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }else{
      user.update({
        notificationPrice : req.body.price
      }, function(err) {});
      res.sendStatus(200);
    }
  });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
