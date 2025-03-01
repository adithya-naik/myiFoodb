// const express = require('express')
// const mongoDB = require('./db');
// const app = express()
// require('dotenv').config()
// mongoDB();


// const port = process.env.PORT

// app.use((req, res, next) => {
//   // react app port number 
//   res.setHeader('Access-Control-Allow-Origin', 'https://myifoodb.onrender.com');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,auth-token, Accept');
//   next();
// });

// app.get('/', (req, res) => {
//   res.send('Hello World! ----')
// })


// app.use(express.json());
// app.use('/api', require('./routes/createUser'));
// app.use('/api', require('./routes/getData'));
// app.use('/api', require('./routes/orderData'));
// app.use('/api', require('./routes/fetchUserOrders'));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })





const express = require('express');
const mongoDB = require('./db');
const cors = require('cors');
const app = express();
require('dotenv').config();
mongoDB();

const port = process.env.PORT;

// Configure cors middleware to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'auth-token', 'Accept']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! ----');
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});
app.use('/api', require('./routes/createUser'));
app.use('/api', require('./routes/getData'));
app.use('/api', require('./routes/orderData'));
app.use('/api', require('./routes/fetchUserOrders'));
// app.use('/api/profile', require('./routes/userProfile'));
try {
  const userProfileRoutes = require('./routes/userProfile');
  app.use('/api', userProfileRoutes);
  console.log('Successfully loaded userProfile routes');
} catch (err) {
  console.error('Error loading userProfile routes:', err);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
