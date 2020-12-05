let mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    surname: {type: String, required: true, maxlength: 100},
    mail: {type: String, maxlength: 100},
    phone: {type: String, default: '+39', maxlength: 20 },
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



//Export model
module.exports = mongoose.model('Client', ClientSchema);
