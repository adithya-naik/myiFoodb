const express = require('express')
const mongoDB = require('./db');
const app = express()
require('dotenv').config()
mongoDB();

const port = process.env.PORT

app.use((req, res, next) => {
  // react app port number 
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,auth-token, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World! ----')
})


app.use(express.json());
app.use('/api', require('./routes/createUser'));
app.use('/api', require('./routes/getData'));
app.use('/api', require('./routes/orderData'));
app.use('/api', require('./routes/fetchUserOrders'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
