var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "flytrendsz@gmail.com",
        pass: "flyinghigh"
    }
});

router.post('/',function(req,res){
  console.log("in nodemailer request: ",req.body);
    var mailOptions={
        to : "madonionik@hotmail.com",
        subject : req.body.subject,
        text : req.body.text
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
});

module.exports = router;
