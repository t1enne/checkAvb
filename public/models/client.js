let mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    surname: {type: String, required: true, maxlength: 100},
    username: {type: String, maxlength: 100},
    provider: {type: String, maxlength: 100},
    dateObj: { type: Date, default: new Date() },
    orders: Array
  }, { toJSON: { virtuals: true } }
);

// Virtual for author's full name
ClientSchema
.virtual('fullname')
.get(function () {
  return this.name + ' ' + this.surname;
});

ClientSchema
.virtual('registeredOn')
.get( function(){
  let d = this.dateObj
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getYear() - 100;
  let date = `${day}/${month}/${year}`
  return date
})

ClientSchema
.virtual('mail')
.get(function () {
  return this.username + '@' + this.provider;
});



//Export model
module.exports = mongoose.model('Client', ClientSchema);
