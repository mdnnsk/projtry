var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var info = require('../models/info');
var bodyParser = require('body-parser');

router.use(bodyParser.json());


router.post('/', function(req, res) {
  console.log("in post route: " + req.body.from);
  console.log("in post route " + req.body.to);
  // db.collection.ensureIndex({"field1":"text","field2":"text"})
  // db.records.runCommand("text",{search:"item1 item2"})
  info.find(
    {$or:[
        {"code":{"$in":[req.body.to,req.body.from]}},
        {"city":{"$in":[req.body.to,req.body.from]}}
    ]}
  ).then(function(data){
    console.log(data);
    var returnCities = [];
    var returnCodes = [];
    var returnData = [returnCities,returnCodes];
    for (var i = 0; i < data.length; i++) {
      returnCodes.push(data[i].code);
      returnCities.push(data[i].city);
    }
    console.log(returnData);
    res.send(returnData);
  });
});




module.exports = router;
