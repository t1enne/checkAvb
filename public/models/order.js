var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    client: {type: Schema.Types.ObjectId, ref: 'Client', required: true},
    piecesNumber: {type: Number, required: true},
  }
);

// Virtual for book's URL
OrderSchema
.virtual('url')
.get(function () {
  return '/catalog/order/' + this._id;
});

//Export model
module.exports = mongoose.model('Order', OrderSchema);
