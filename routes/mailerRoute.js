var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "flytrendsz@gmail.com",
        pass: "flyinghigh"
    }
});

router.post('/',function(req,res){
  console.log("in nodemailer request: ",req.body);
    var mailOptions={
        to : req.body.to,
        subject : req.body.subject,
        text : req.body.text
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    }
  });
});

module.exports = router;
