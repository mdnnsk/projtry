var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var passport = require('./strategies/userStrategy');
var session = require('express-session');

// Route includes
var data = require('./routes/dataRoute');
var index = require('./routes/indexRoute');
var user = require('./routes/userRoute');
var register = require('./routes/registerRoute');
var location = require('./routes/locationRoute');
var mailer = require('./routes/mailerRoute');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static(path.join(__dirname, './public')));

// Passport Session Configuration //
app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 60000, secure: false }
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/data', data);
app.use('/location', location);
app.use('/register', register);
app.use('/user', user);
app.use('/*', index);
app.use('/send', mailer);

// Mongo Connection //
var mongoURI = "mongodb://localhost:27017/flights";
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
   if(err) {
     console.log("MONGO ERROR: ", err);
   }
});

mongoDB.once('open', function(){
   console.log("Connected to Mongo!");
});

// App Set //
app.set('port', (process.env.PORT || 5000));

// Listen //
app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});
