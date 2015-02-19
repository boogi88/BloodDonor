var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var donorsSchema = new Schema({
  name: {first : String, last: String},
  bloodGroup : String,
  lastDonated : String,
  fbToken : String,
  gToken : String  
});

mongoose.model('donors', donorsSchema);