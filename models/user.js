var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
// var info = require('../models/info');

// Mongoose Schema
var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    trackDate: {type:Date, default:null},
    homeLoc: {
      code: String,
      name: String,
      city: String,
      state: String,
      country: String,
      icao: String,
    },
    destLoc: {
      code: String,
      name: String,
      city: String,
      state: String,
      country: String,
      icao: String
    }
    // homeLoc: [{type: mongoose.Schema.Types.ObjectId, ref: 'info', default : null}],
    // destLoc: [{type: mongoose.Schema.Types.ObjectId, ref: 'info', default : null}]
});

// Called before adding a new user to the DB. Encrypts password.
UserSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) {
      return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
          return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
              return next(err);
            }

            user.password = hash;
            next();
        })
    })
});

// Used by login methods to compare login form password to DB password
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) {
          return callback(err);
        }

        callback(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);
