const express = require('express');
const cookieParser = require('cookie-parser');
let session = require('express-session');
const getter = require('./index.js');
require('dotenv').config();
const mongoose = require('mongoose');
// let OrderInstance = require("./public/models/client");
const Client = require("./public/models/client");


// MONGOOSE
let mongoUrl = process.env.MONGOLAB_URI
mongoose.connect(mongoUrl, {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to DB');
});

// ORDER instance
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

app.use(express.static('public/dist'));

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

// Add Order to List
app.get(`/api/addOrder/:user/:year/:season/:model/:color/:size/:sizeForReq/`, async (req, res) => {
  let order = await new OrderInstance({ year: req.params.year, season: req.params.season, model: req.params.model, color: req.params.color, size: req.params.size, sizeForReq: req.params.sizeForReq, user: req.params.user });
  order.save( (err, order) => {
    if(err) console.error(err)
    console.log(order);
  })
})

// ADD NEW CLIENT
app.get(`/api/newClient/:name/:surname/:username/:provider/:tail`, async (req, res) => {
  let client = await new Client({ name: req.params.name, surname: req.params.surname, username: req.params.username, provider: req.params.provider + '.' + req.params.tail });
  client.save( (err, client) => {
    if(err) console.error(err)
    console.log(client);
    res.json(client)
  })
})


// DISPLAY HISTORY OF Searches
app.get(`/api/:user/OrderInstances`, async (req, res) => {
  await OrderInstance.find( { user: req.params.user }, (err, orders) => {
    if (err) console.error(err);
    res.json(orders)
  })
});

// DISPLAY ALL CLIENTS
app.get(`/api/listClients`, async (req, res) => {
  await Client.find( {}, (err, clients) => {
    if (err) console.error(err);
    res.json(clients)
  })
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
