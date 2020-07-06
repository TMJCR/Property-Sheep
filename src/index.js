const express = require('express');
require('./db/mongoose');

const landlordRouter = require('./routers/landlord');
const propertyRouter = require('./routers/property');
const app = express();

app.use(express.json());
app.use(landlordRouter);
app.use(propertyRouter);

const port = process.env.PORT || 3000;

app.get('/landlords', (req, res) => {
  res.send('hi');
});

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
