var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
  code: String,
  name: String,
  city: String,
  state: String,
  country: String,
  icao: String
});

var info=mongoose.model('info', InfoSchema);
module.exports=info;
