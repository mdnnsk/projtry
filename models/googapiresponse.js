var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responseSchema = new Schema({
  origin: String,
  destination: String,
  price: String,
  date: Date,
  querydate: Date
});

var response=mongoose.model('response', responseSchema);
module.exports=response;
