let mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    surname: {type: String, required: true, maxlength: 100},
    username: {type: String, maxlength: 100},
    provider: {type: String, maxlength: 100},
    orders: Array
  }, { toJSON: { virtuals: true } }
);

// Virtual for author's full name
ClientSchema
.virtual('fullname')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});
ClientSchema
.virtual('mail')
.get(function () {
  return this.username + '@' + this.provider;
});


//Export model
module.exports = mongoose.model('Client', ClientSchema);
