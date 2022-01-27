const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const RECIPE_PROPERTIES = require('../../client/src/javascript/PROPERTIES_FOR_BACKEND.js');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

//Import record schema
let Record = require('../models/record.model');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

// This section will help you get a list of all the records.
recordRoutes.route('/record').get(function (req, res) {
  let db_connect = dbo.getDb('recipes');
  db_connect
    .collection('records')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
})


// This section will help you get a single record by id
recordRoutes.route('/record/:id').get(function (req, res) {
  let db_connect = dbo.getDb();
  let myQuery = { _id: ObjectId(req.params.id) };
  db_connect.collection('records').findOne(myQuery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new record.
recordRoutes.route('/record/add').post(upload.single('image'), (req, response) => {
  let db_connect = dbo.getDb();
  let imageValue = '';
  if (req.body.image) {
    imageValue = req.body.image;
  } else if (req.file === undefined) {
    imageValue = 'placeholder.jpg';
  } else {
    imageValue = req.file.filename;
  };

    // Generate new object based on record properties defined in RECIPE_PROPERTIES array
    //JSON.stringify and JSON.parse are use on front and backend respectively, specifically to handle object data coming from extendedIngredients and analyzedInstructions
      let myObj = {};
      for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
        if (RECIPE_PROPERTIES[i] === 'image') {
          myObj['image'] = imageValue;
        } else {
          myObj[RECIPE_PROPERTIES[i]] = JSON.parse(req.body[RECIPE_PROPERTIES[i]]);
        }
      }

  const newRecord = new Record(myObj);

  db_connect.collection('records').insertOne(newRecord, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route('/update/:id').post(upload.single('image'), (req, response) => {
  let db_connect = dbo.getDb();
  let myQuery = { _id: ObjectId(req.params.id) };

    let myObj = {};
    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (RECIPE_PROPERTIES[i] === 'image') {

        //First, check to see if image is a url
        if (req.body.image.slice(0, 4) === 'http') {
          myObj['image'] = req.body.image;
        } else if (req.file) {
            myObj['image'] = req.file.filename;
          } else {
            myObj['image'] = req.body.image;
          }
      } else {
        myObj[RECIPE_PROPERTIES[i]] = JSON.parse(
          req.body[RECIPE_PROPERTIES[i]]
        );
      }
    }

  let newvalues = {
    $set: myObj,
    $currentDate: { lastModified: true },
  };
  db_connect
    .collection('records')
    .updateOne(myQuery, newvalues, function (err, res) {
      if (err) throw err;
      console.log('1 document updated');
      response.json(res);
    });
});

async function returnDocument(db, query) {
  let returnedDocument = db.collection('records').findOne(query);
  return returnedDocument;
};

// This section will help you delete a record
recordRoutes.route('/:id').delete((req, response) => {
  let db_connect = dbo.getDb();
  let myQuery = { _id: ObjectId(req.params.id) };

  returnDocument(db_connect, myQuery)
  .then( (returnedDocument) => {

    // Delete image file from server
    let filePathAndName = `../client/public/images/${returnedDocument.image}`;
    if (returnedDocument.image !== 'placeholder.jpg') {
    fs.unlink(filePathAndName, (err) => {
      if (err) console.log(err);
      }
    );
    }

    db_connect.collection('records').deleteOne(myQuery, function (err, obj) {
      if (err) throw err;
      console.log('1 document deleted');
      response.status(obj);
    });
  });
});

module.exports = recordRoutes;
