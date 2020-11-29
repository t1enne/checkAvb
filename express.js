const express = require('express');
const cookieParser = require('cookie-parser');
let session = require('express-session');
const getter = require('./index.js');
require('dotenv').config();
const mongoose = require('mongoose');
const Client = require("./public/models/client");
const SearchInstance = require("./public/models/search");
const OrderInstance = require("./public/models/order");

// MONGOOSE
let mongoUrl = process.env.MONGOLAB_URI
mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to DB');
});

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
  saveUninitialized: true
}));

app.use(express.static('public/dist'));

//CHECK IF LOGGED

app.get('/logged', (req, res) => {
  if (req.session) {
    res.json(req.session)
  } else {
    res.end('Not Logged!')
  }
})


// app.get('/logged', (req, res) => {
//   let session = {
//     "cookie": {
//       "originalMaxAge": 43200000,
//       "expires": "2020-11-28T07:21:40.690Z",
//       "httpOnly": true,
//       "path": "/",
//       "sameSite": "strict"
//     },
//     "smurf": "SmurfID=0020925c832a4aa1e112ba7d5b01efcbc6f20a9fb12f56235ba649d3789821c9",
//     "user": "ntaov"
//
//   }
//   res.json(session)
// })

// GET COOKIE
app.get('/api/login/:user/:pwd', async (req, res) => {
  console.log('login req');
  let smurfId = await getter.getCookie(req.params.user, req.params.pwd);
  req.session.smurf = smurfId.cookie;
  req.session.user = req.params.user;
  console.log(req.session);

  // req.session.smurf = smurfId.cookie;
  // req.session.user = req.params.user;
  res.json(req.session)
});

//GET IMAGE
app.get(`/api/image/:year/:season/:model/`, async (req, res) => {
  let b64 = await getter.getImage(req.session.smurf, req.params.year, req.params.season, req.params.model);
  // let b64 = 'logo.86ce68ea.svg'
  // setTimeout(() => {
  //
  // }, 1000)
  res.send(b64)
});


let mockRes = {
  "1": {
    "year": "20",
    "season": "2",
    "model": "MCS42741",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "202 MCS42741 CS170",
    "receivables": {},
    "sizesForRequests": [
      "03", "04"
    ],
    "sizes": ["M", "L"]
  },
  "2": {
    "year": "20",
    "season": "2",
    "model": "M2240900",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "202 M2240900 CS170",
    "receivables": {},
    "sizesForRequests": [
      "04", "05"
    ],
    "sizes": ["L", "XL"]
  },
  "3": {
    "year": "20",
    "season": "2",
    "model": "M2293118",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "202 M2293118 CS170",
    "receivables": {},
    "sizesForRequests": [
      "03", "04"
    ],
    "sizes": ["M", "L"]
  },
  "5": {
    "year": "20",
    "season": "2",
    "model": "M2300106",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "202 M2300106 CS170",
    "receivables": {},
    "sizesForRequests": [
      "03", "04", "06", "07"
    ],
    "sizes": ["46", "48", "52", "54"]
  },
  "6": {
    "year": "19",
    "season": "2",
    "model": "M2300106",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "192 M2300106 CS170",
    "receivables": {},
    "sizesForRequests": [
      "02",
      "05",
      "06",
      "07",
      "09",
      "10"
    ],
    "sizes": [
      "44",
      "50",
      "52",
      "54",
      "58",
      "60"
    ]
  },
  "7": {
    "year": "19",
    "season": "2",
    "model": "M2300124",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "192 M2300124 CS170",
    "receivables": {},
    "sizesForRequests": ["03"],
    "sizes": ["46"]
  },
  "8": {
    "year": "19",
    "season": "1",
    "model": "M2200100",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "191 M2200100 CS170",
    "receivables": {},
    "sizesForRequests": ["07"],
    "sizes": ["54"]
  },
  "9": {
    "year": "18",
    "season": "2",
    "model": "M2300100",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "182 M2300100 CS170",
    "receivables": {},
    "sizesForRequests": ["07"],
    "sizes": ["54"]
  },
  "10": {
    "year": "18",
    "season": "1",
    "model": "M2300100",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "181 M2300100 CS170",
    "receivables": {},
    "sizesForRequests": [
      "04", "06", "07", "08"
    ],
    "sizes": ["48", "52", "54", "56"]
  },
  "11": {
    "year": "17",
    "season": "2",
    "model": "M2300100",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "172 M2300100 CS170",
    "receivables": {},
    "sizesForRequests": ["08"],
    "sizes": ["56"]
  },
  "12": {
    "year": "17",
    "season": "2",
    "model": "M2300162",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "172 M2300162 CS170",
    "receivables": {},
    "sizesForRequests": ["07"],
    "sizes": ["54"]
  },
  "13": {
    "year": "17",
    "season": "1",
    "model": "M2300162",
    "color": "CS170",
    "descr": "CIOTTOLO+GRIGIO SCURO",
    "string": "171 M2300162 CS170",
    "receivables": {},
    "sizesForRequests": ["07"],
    "sizes": ["54"]
  }
}
// GET AVB
app.get('/api/avb/:model/:color/', async (req, res) => {
  const avb = await getter.getAvb(req.session.smurf, req.params.model, req.params.color);

  // moch resposne
  // setTimeout(() => {
  //   res.json(mockRes)
  // }, 500)

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

// Add Search
app.get(`/api/addSearch/:user/:year/:season/:model/:color/:size/:sizeForReq/:price`, async (req, res) => {
  let order = await new SearchInstance({
    year: req.params.year,
    season: req.params.season,
    model: req.params.model,
    color: req.params.color,
    size: req.params.size,
    price: req.params.price,
    sizeForReq: req.params.sizeForReq,
    user: req.params.user
  });
  order.save((err, search) => {
    if (err)
      console.error(err)
    res.json(search)
  })
})

// ADD NEW CLIENT
app.get(`/api/newClient/:name/:surname/:username/:provider/:tail`, async (req, res) => {
  let client = await new Client({
    name: req.params.name,
    surname: req.params.surname,
    username: req.params.username,
    provider: req.params.provider + '.' + req.params.tail
  });
  client.save((err, client) => {
    if (err)
      console.error(err)
    res.json(client)
  })
})

// Update order

// TODO: when I assign Search to Order, push searchId to OrderInstance.searches

app.get('/api/addToClient/:orderId/:searchId', async (req, res) => {
  await SearchInstance.updateOne({
    _id: req.params.searchId
  }, {
    order: req.params.orderId
  })
  await SearchInstance.find({
    order: req.params.orderId
  }, (err, order) => {
    if (err) console.error(err);
    res.json(order)
  })
})

// CREATE ORDER
app.post(`/api/createOrder/:client/:user/:name`, async (req, res) => {
  let fullname = req.params.name.split('&');
  let name = fullname[0]
  let surname = fullname[1]
  let order = await new OrderInstance({
    clientId: req.params.client,
    clientName: `${name} ${surname}`,
    user: req.session.user
  });
  await order.save((err, order) => {
    if (err)
      console.error(err)
    res.json(order);
  })

})
// LIST ORDERS
app.get(`/api/listOrders`, async (req, res) => {
  await OrderInstance.find({}, (err, orders) => {
    if (err) console.error(err);
    res.json(orders)
  })
})

// DELETE ONE ORDER {
app.delete(`/api/deleteOrder/:orderId`, async (req, res) => {
  await OrderInstance.findByIdAndRemove(req.params.orderId, (err, order) => {
    if (err) console.error(err);
    res.json(order)
  })
});

// DISPLAY SEARCHES FOR EACH Order
app.get(`/api/:order/SearchInstances`, async (req, res) => {
  await SearchInstance.find({
    order: req.params.order
  }, (err, searches) => {
    console.log('order is ' + req.params.order);
    if (err)
      console.error(err);
    res.json(searches)
  })
});

// DISPLAY HISTORY OF Searches for user
app.get(`/api/:user/SearchInstances`, async (req, res) => {
  await SearchInstance.find({
    user: req.params.user
  }.limit(10), (err, searches) => {
    if (err)
      console.error(err);
    res.json(searches)
  })
});

// DISPLAY UNASSIGNED SEARCHES
app.get(`/api/SearchInstances`, async (req, res) => {
  await SearchInstance.find({}, (err, searches) => {
    if (err)
      console.error(err);
    res.json(searches)
  })
});

// DISPLAY ALL CLIENTS
app.get(`/api/listClients`, async (req, res) => {
  await Client.find({}, (err, clients) => {
    if (err)
      console.error(err);
    res.json(clients)
  })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});