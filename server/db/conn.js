// const { MongoClient } = require('mongodb');
// const Db = process.env.ATLAS_URI;
// const client = new MongoClient(Db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// var _db;

// module.exports = {
//   connectToServer: function (callback) {
//     client.connect(function (err, db) {
//       // Verify we got a good "db" object
//       if (db) {
//         _db = db.db('myFirstDatabase');
//         console.log('Successfully connected to MongoDB.');
//       }
//       return callback(err);
//     });
//   },

//   getDb: function () {
//     return _db;
//   },
// };
const mongoose = require('mongoose');

let _db;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

module.exports = {
  connectToServer: function (callback) {
    connection.once('open', (err, db) => {
      if (db) {
        _db = connection;
        console.log('Successfully connected to MongoDB.');
      }
      return callback(err);
    });
  },
    getDb: function () {
      return connection;
    },
};


