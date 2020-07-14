const express = require('express');
require('./db/mongoose');

const landlordRouter = require('./routers/landlord');
const propertyRouter = require('./routers/property');
const cookieParser = require('cookie-parser');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(landlordRouter);
app.use(propertyRouter);

const port = process.env.PORT || 3000;

app.get('/landlords', (req, res) => {
  res.send('hi');
});

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
