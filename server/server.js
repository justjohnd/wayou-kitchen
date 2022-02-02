const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;
const errorHandler = require('./middleware/error');

app.use(cors());

//Middleware that allows you to get data from request.body
app.use(express.json());
//Redirect anything that goes to /api/auth to the auth route
app.use('/api/auth', require('./routes/auth'));
app.use(require('./routes/record'));
app.use(require('./routes/urlSearch'));
// get driver connection
const dbo = require('./db/conn');

// Error Handler (should be last piece of middleware)
app.use(errorHandler);

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
