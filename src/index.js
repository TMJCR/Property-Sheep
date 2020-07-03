const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;

app.use((req, res) => {
  res.send('There is no page -  404');
});

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
