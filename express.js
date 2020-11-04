const express = require('express');
const cookieParser = require('cookie-parser');
let session = require('express-session');
const getter = require('./index.js');
require('dotenv').config();
const mongoose = require('mongoose');


// MONGOOSE
let mongoUrl = process.env.MONGOLAB_URI
mongoose.connect(mongoUrl, {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to DB');
});

let SearchInstanceSchema = new mongoose.Schema({
  model: String,
  color: String,
  user: String,
  dateObj: { type: Date, default: new Date() }
}, { toJSON: { virtuals: true } } );

SearchInstanceSchema.virtual('string').get(function() {
  return this.model + ' ' + this.color;
});
SearchInstanceSchema.virtual('date').get(function() {
  let d = this.dateObj
  let day = d.getDay() + 1;
  let month = d.getMonth() + 1;
  let year = d.getYear() - 100;
  let date = `${day}/${month}/${year}`
  return date
});

const SearchInstance = mongoose.model('SearchInstance', SearchInstanceSchema);


// ALTERNATIVE WAY TO CREATE/SAVE MODEL
// ClientOrders.create({ name: 'Naz', surname: 'Taov' }, (err, example_instance) => {
//   if(err) return handleError(err)
// })








// END OF MONGOOSE

const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 24 * 30,
    sameSite: 'strict'

  },
  rolling: true,
  resave: true,
  saveUninitialized: true,
}));

app.use(express.static('public'));

// CHECK IF LOGGED
app.get('/logged', (req, res) => {
  if (req.session) {
    res.json(req.session)
  } else {
    res.end('Not Logged!')
  }
})
// GET COOKIE
app.get('/api/login/:user/:pwd', async (req, res) => {
  let smurfId = await getter.getCookie(req.params.user, req.params.pwd);
  req.session.smurf = smurfId.cookie;
  req.session.user = req.params.user;
  res.json(req.session)
});

//GET IMAGE
app.get(`/api/image/:year/:season/:model/`, async (req, res) => {
  let b64 = await getter.getImage(req.session.smurf, req.params.year, req.params.season, req.params.model);
  res.send(b64)
});


// GET AVB
app.get('/api/avb/:user/:model/:color/', async (req, res) => {
  const avb = await getter.getAvb(req.session.smurf, req.params.model, req.params.color);
  let search = new SearchInstance({ model: req.params.model, color: req.params.color, user: req.params.user });
  search.save( (err, search) => {
    if(err) console.error(err)
  })
  res.json(avb)
});

// GET receivables
app.get(`/api/request/:year/:season/:model/:color/`, async (req, res) => {
  const tr = await getter.getReceivables(req.session.smurf, req.params.year, req.params.season, req.params.model, req.params.color);
  res.json(tr);
});

// GET SHOP DETAILS
app.get('/api/:year/:season/:model/:color/:size', async (req, res) => {
  const avb = await getter.getShops(req.session.smurf, req.params.year, req.params.season, req.params.model, req.params.color, req.params.size);
  res.json(avb)
});


// GET Prices
app.get(`/api/price/:year/:season/:model/`, async (req, res) => {
  let price = await getter.getPrice(req.session.smurf, req.params.year, req.params.season, req.params.model);
  res.json(price);
});

// DISPLAY HISTORY OF Searches
app.get(`/api/:user/SearchInstance`, async (req, res) => {
  await SearchInstance.find( { user: req.params.user }, (err, searches) => {
    if (err) console.error(err);
    res.json(searches)
  })
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
