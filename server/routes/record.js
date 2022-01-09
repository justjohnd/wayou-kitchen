const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

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
    cb(null, 'images');
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
});

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
  let myObj = {
    title: req.body.title,
    extendedIngredients: req.body.extendedIngredients,
    preparationMinutes: req.body.preparationMinutes,
    cookingMinutes: req.body.cookingMinutes,
    readyInMinutes: req.body.readyInMinutes,
    sourceUrl: req.body.sourceUrl,
    image: req.file.filename,
    analyzedInstructions: req.body.analyzedInstructions,
    servings: req.body.servings,
  };

  const newRecord = new Record(myObj);

  db_connect.collection('records').insertOne(newRecord, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route('/update/:id').post(function (req, response) {
  let db_connect = dbo.getDb();
  let myQuery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      title: req.body.title,
      extendedIngredients: req.body.extendedIngredients,
      preparationMinutes: req.body.preparationMinutes,
      cookingMinutes: req.body.cookingMinutes,
      readyInMinutes: req.body.readyInMinutes,
      sourceUrl: req.body.sourceUrl,
      image: req.body.image,
      analyzedInstructions: req.body.analyzedInstructions,
      servings: req.body.servings,
    },
  };
  db_connect
    .collection('records')
    .updateOne(myQuery, newvalues, function (err, res) {
      if (err) throw err;
      console.log('1 document updated');
      response.json(res);
    });
});

// This section will help you delete a record
recordRoutes.route('/:id').delete((req, response) => {
  let db_connect = dbo.getDb();
  let myQuery = { _id: ObjectId(req.params.id) };
  db_connect.collection('records').deleteOne(myQuery, function (err, obj) {
    if (err) throw err;
    console.log('1 document deleted');
    response.status(obj);
  });
});

module.exports = recordRoutes;
