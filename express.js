const express = require('express');
let session = require('express-session');
const cookieParser = require('cookie-parser');
const getter = require('./index.js');
require('dotenv').config();
const mongoose = require('mongoose');
const Client = require("./public/models/client");
const SearchInstance = require("./public/models/search");
const OrderInstance = require("./public/models/order");
const Request = require("./public/models/request")
const socketInit = require('./sockets.js')

const app = express();


// MONGOOSE
let mongoUrl = process.env.MONGOLAB_URI
mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.on('error', console.log('connection error'));
db.once('open', () => {
  console.log('connected to DB');
});

// END OF MONGOOSE

// SOCKET.IO

const server = require('http').createServer(app);

socketInit(server)

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 5,
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

app.post('/api/session', (req, res) => {
  req.session.smurf = req.headers.smurf
  req.session.user = req.headers.user
  res.json(req.session)
})


// LOGIN
app.get('/api/login', async (req, res) => {
  let response = await getter.getCookie(req.headers.user, req.headers.pwd);
  req.session.smurf = response.cookie;
  req.session.user = req.headers.user;
  // console.log(req.session);
  res.json(req.session)
});

app.get('/api/logout', async (req, res) => {
  req.session.smurf = null
  req.session.user = null
  res.json(req.session)
})


/*
<===========>
  GET IMAGE
<===========>
*/

app.get(`/api/image/:year/:season/:model/`, async (req, res) => {
  if (!req.session.smurf) {
    req.session.smurf = req.headers.smurf
  }
  let b64 = await getter.getImage(req.session.smurf, req.params.year, req.params.season, req.params.model);
  // setTimeout(() => {
  //
  // }, 1000)
  res.send(b64)
});


/*
<===========>
  GET AVB
<===========>
*/
app.get('/api/avb/:model/:color/', async (req, res) => {
  const avb = await getter.getAvb(req.session.smurf, req.params.model, req.params.color);
  res.json(avb)
});

// app.get('/api/anagrafica', async (req, res) => {
//
// })

/*
<===========>
  GET receivables
<===========>
*/

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
app.get(`/api/addSearch`, async (req, res) => {
  console.log(req.headers)

  let order = await new SearchInstance({
    year: req.headers.year,
    season: req.headers.season,
    model: req.headers.model,
    color: req.headers.color,
    size: req.headers.size,
    price: req.headers.price,
    sizeForReq: req.headers.sizeforreq,
    descr: req.headers.descr,
    user: req.session.user
  });
  order.save((err, search) => {
    if (err)
      console.error(err)
    res.json(search)
  })
})

// ADD NEW CLIENT
app.get(`/api/newClient`, async (req, res) => {
  console.log(req.headers);
  let client = await new Client({
    name: req.headers.name,
    surname: req.headers.surname,
    mail: req.headers.username,
    phone: req.headers.phone
  });
  client.save((err, client) => {
    if (err) console.error(err)
    res.json(client)
  })
})

// DELETE CLIENT
app.delete('/api/delete/:clientId', async (req, res) => {
  await Client.findByIdAndRemove(req.params.clientId, (err, client) => {
    if (err) console.log(err);
    console.log(client);
    res.json(client)
  })
})


// Update order

// TODO: when I assign Search to Order, push searchId to OrderInstance.searches

app.get('/api/addToClient/:orderId/:searchId', async (req, res) => {
  let updateSearch = {
    order: req.params.orderId
  }

  await SearchInstance.findOneAndUpdate({
      _id: req.params.searchId
    }, updateSearch, null,
    function(err, order) {
      if (err) console.error(err);
      res.json(order)
    })
})

// CREATE ORDER
app.post(`/api/createOrder/:client/:name`, async (req, res) => {
  let fullname = req.params.name.split('&');
  let name = fullname[0]
  let surname = fullname[1]
  let order = await new OrderInstance({
    clientId: req.params.client,
    clientName: `${name} ${surname}`,
    user: req.session.user
  });
  await order.save((err, order) => {
    if (err) console.error(err)
    console.log(order);
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

// GET ONE ORDER

app.get(`/api/order/:id`, async (req, res) => {
  await OrderInstance.find({
    _id: req.params.id
  }, (err, order) => {
    if (err) console.error(err);
    res.json(order[0])
  })
})

// DELETE ONE ORDER {
app.delete(`/api/deleteOrder/:orderId`, async (req, res) => {
  await OrderInstance.findByIdAndRemove(req.params.orderId, (err, order) => {
    if (err) console.error(err);
    res.json(order)
  })
});

// DISPLAY ASSIGNED SEARCHES
app.get(`/api/:order/SearchInstances`, async (req, res) => {
  await SearchInstance.find({
    order: req.params.order
  }, (err, searches) => {
    console.log('Getting assigned searches for order ' + req.params.order);
    if (err) console.error(err);
    res.json(searches)
  })
});

// DISPLAY HISTORY OF Searches for user
app.get(`/api/:user/SearchInstances`, async (req, res) => {
  await SearchInstance.find({
    user: req.params.user
  }, (err, searches) => {
    if (err) console.error(err);
    res.json(searches)
  })
});

// LIST UNASSIGNED SEARCHES
app.get(`/api/SearchInstances/unassigned`, async (req, res) => {
  await SearchInstance.find({
    order: 'unassigned'
  }, (err, searches) => {
    if (err)
      console.error(err);
    res.json(searches)
  })
});


// LIST ALL SEARCHES
app.get(`/api/SearchInstances`, async (req, res) => {
  await SearchInstance.find({}, (err, searches) => {
    if (err)
      console.error(err);
    res.json(searches)
  }).sort({
    dateObj: -1
  })
});

app.delete('/api/deleteSearches', async (req, res) => {
  await SearchInstance.deleteMany({
    order: 'unassigned'
  }, (err, searches) => {
    if (err) console.error(err);
    console.log('deleted ' + searches.n);
    res.json(searches.n)
  })
})


app.delete('/api/deleteAssignedSearches/', async (req, res) => {
  console.log(req.headers);
  await SearchInstance.deleteMany({
    order: req.headers.order
  }, (err, searches) => {
    if (err) console.error(err);
    console.log('deleted ' + searches.n);
    res.json(searches.n)
  })
})

// DISPLAY ALL CLIENTS
app.get(`/api/listClients`, async (req, res) => {
  await Client.find({}, (err, clients) => {
    if (err)
      console.error(err);
    res.json(clients)
  })
});

// DISPLAY ONE CLIENT
app.get(`/api/client/:id`, async (req, res) => {
  await Client.find({
    _id: req.params.id
  }, (err, client) => {
    if (err) console.error(err);
    res.json(client)
  })
})

// UPDATE ONE CLIENT
app.post('/api/updateClient', async (req, res) => {
  let update = {
    name: req.headers.name,
    surname: req.headers.surname,
    mail: req.headers.mail,
    phone: req.headers.phone
  }
  await Client.findOneAndUpdate({
    _id: req.headers.id
  }, update, {
    new: true
  }, (err, client) => {
    if (err) console.error(err);
    res.json(client)
  })
})

// GET TRACKING STATUS
app.get('/api/tracking/:awb', async (req, res) => {
  let awb = await getter.getDhl(req.params.awb)
  res.json(awb.results)
})

/*
<===========>
  Requests handler
<===========>
*/

// load requests

app.get('/api/listRequests', async (req, res) => {
  await Request.find({}, (err, requests) => {
    if (err) console.error(err);
    res.json(requests)
  })
})

// add request

app.get(`/api/newRequest`, async (req, res) => {
  let request = await new Request({
    user: req.headers.user
  });
  request.save((err, request) => {
    if (err) console.error(err)
    console.log(request);
    res.json(request)
  })
})


// update request

app.get('/api/updateRequest', async (req, res) => {

  await Request.findOneAndUpdate({
    id: req.headers.id
  }, update, {
    new: true
  }, (err, request) => {
    if (err) console.error(err);
    res.json(request)
  })
})

// update requests

app.post('/api/updateRequests', async (req, res) => {
  // idValues is an array joined with '&'
  let {
    id,
    idfields,
    idvalues,
    last
  } = req.headers
  let update = {}

  idfields = idfields.split(',')
  idvalues = idvalues.split('&')

  idfields.forEach((field, i) => {
    update[field] = idvalues[i]
  });

  await Request.findOneAndUpdate({
    _id: id
  }, update, {
    new: true
  }, (err, request) => {
    if (err) console.error(err);
    res.json(request)
  })
})

// delete request

app.delete('/api/deleteRequest', async (req, res) => {
  await Request.findByIdAndRemove(req.headers.id, (err, request) => {
    if (err) console.error(err)
    res.json(request)
  })
})
