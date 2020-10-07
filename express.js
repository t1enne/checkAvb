const express = require('express');
const getAvb = require('./parallel.js');

const app = express();

app.use(express.static('public'));
app.get('/api/avb/:model/:color/img=:withImage', async (req, res) => {
  const avb = await getAvb(req.params.model, req.params.color, req.params.withImage);
  res.json(avb)
})

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});