const mongoose = require('mongoose');

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

module.exports = {
  connectToServer: function (callback) {
    connection.once('open', (err, db) => {
      if (db) {
        console.log('Successfully connected to MongoDB.');
      }
      return callback(err);
    });
  },
    getDb: function () {
      return connection;
    },
};


