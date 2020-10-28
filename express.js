const express = require('express');
const cookieParser = require('cookie-parser');
let session = require('express-session');
const getter = require('./index.js');

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

app.get('/api/avb/:model/:color/', async (req, res) => {
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




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
