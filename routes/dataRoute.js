var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var response = require('../models/googapiresponse.js');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', function(req,res){
  response.find().sort({querydate: 1}).then( function( data ){
      // console.log(data);
      res.send( data );
    });
  });

router.post('/', function(req, res) {
  console.log(req.body[0]);
    var tripData = req.body[0];
    var legData = tripData.slice[0].segment[0].leg[0];
    console.log("legData: " , legData);
    var qpxData = new response({
      origin: legData.origin,
      destination: legData.destination,
      price: tripData.saleTotal.slice(3,tripData.saleTotal.length),
      date: legData.departureTime,
      querydate: new Date(Date.now()).toISOString()
  });
    qpxData.save(function(err){
    if (err){
      console.log(err);
      res.sendStatus(500);
    }else{
      console.log('data saved succesfully');
      res.sendStatus(200);
    }
  });
});

module.exports = router;
