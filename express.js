const express = require('express');
const cookieParser = require('cookie-parser');
let session = require('express-session');
const getter = require('./index.js');

const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 24 * 30
  },
  rolling: true,
  resave: true,
  saveUninitialized: true
}));

app.use(express.static('public'));

//GET IMAGE
app.get(`/api/:user/image/:model/`, async (req, res) => {
  let b64 = await getter.getImage(req.session.smurf, req.params.model);
  res.send(b64)
});

// CHECK IF LOGGED
app.get('/logged', (req, res) => {
  if (req.session) {
    console.log(req.session);
    res.json(req.session)
  } else {
    res.end('Not Logged!')
  }
})

// GET COOKIE
app.get('/api/login/:user/:pwd', async (req, res) => {
  let smurfId = await getter.getCookie('ntaov', 'ntaov345');
  req.session.smurf = smurfId.cookie;
  req.session.user = req.params.user;
  console.log(req.session);
  res.json(req.session)
});

// GET AVB

app.get('/api/:user/avb/:model/:color/', async (req, res) => {
  console.log(req.session);
  const avb = await getter.getAvb(req.session.smurf, req.params.model, req.params.color, req.params.withImage);

  res.json(avb)
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
