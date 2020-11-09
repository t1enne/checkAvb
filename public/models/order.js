let mongoose = require('mongoose');

let OrderInstanceSchema = new mongoose.Schema({
  year: String,
  season: String,
  model: String,
  color: String,
  size: String,
  sizeForReq: String,
  user: String,
  client: {type: String, default: "unassigned"},
  dateObj: { type: Date, default: new Date() }
}, { toJSON: { virtuals: true } } );

OrderInstanceSchema.virtual('date').get(function() {
  let d = this.dateObj
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getYear() - 100;
  let date = `${day}/${month}/${year}`
  return date
});

const OrderInstance = mongoose.model('OrderInstance', OrderInstanceSchema);

module.exports = OrderInstance;
// module.exports = mongoose.model('OrderInstance', OrderInstanceSchema);
