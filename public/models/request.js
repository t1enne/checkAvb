let mongoose = require('mongoose');

let dateObject = new Date()

let d = dateObject
let day = d.getDate();
let month = d.getMonth() + 1;
let year = d.getYear() - 100;
let date = `${day}.${month}.${year}`


let RequestSchema = new mongoose.Schema({
  nr: { type: String, default: ''},
  day: {type: String, default: date},
  season: { type: String, default: ''},
  line: { type: String, default: ''},
  model: { type: String, default: ''},
  color: { type: String, default: ''},
  size: { type: String, default: ''},
  user: { type: String, default: ''},
  client: { type: String, default: ''},
  feedback: { type: String, default: ''},
  order: { type: String, default: ''},
  status: {type: String, default: 'richiesto'}
},{
    versionKey: false // You should be aware of the outcome after set to false
})

const Request = mongoose.model('RequestInstance', RequestSchema);

module.exports = Request;
