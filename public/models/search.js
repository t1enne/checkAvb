let mongoose = require('mongoose');

let SearchInstanceSchema = new mongoose.Schema({
  year: String,
  season: String,
  model: String,
  color: String,
  size: String,
  sizeForReq: String,
  price: String,
  user: String,
  clientName: {type: String, default: "unassigned"},
  order: {type: String, default: "unassigned"},
  dateObj: { type: Date, default: new Date() }
}, { toJSON: { virtuals: true } } );

SearchInstanceSchema.virtual('date').get(function() {
  let d = this.dateObj
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getYear() - 100;
  let date = `${day}/${month}/${year}`
  return date
});

const SearchInstance = mongoose.model('SearchInstance', SearchInstanceSchema);

module.exports = SearchInstance;
