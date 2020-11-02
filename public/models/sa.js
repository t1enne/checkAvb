let mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SASchema = new Schema(
  {
    username: {type: String, required: true, maxlength: 100},
  }
);


// Virtual for author's URL
SASchema
.virtual('url')
.get(function () {
  return '/catalog/sa/' + this._id;
});

//Export model
module.exports = mongoose.model('SA', SASchema);
