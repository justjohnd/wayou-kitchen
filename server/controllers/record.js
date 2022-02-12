const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const RECIPE_PROPERTIES = require('../../client/src/javascript/PROPERTIES_FOR_BACKEND.js');

// This will help us connect to the database
const dbo = require('../db/conn');

//Import record schema
let Record = require('../models/record.model');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

//when working with the database always use async functions
exports.allRecords = async (req, res, next) => {
  // Use try...catch to catch any errors when using async code
  try {
    let db_connect = dbo.getDb();
    await db_connect
      .collection('records')
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  } catch (error) {
    next(error);
  }
};

exports.recordById = async (req, res, next) => {
  try {
    let db_connect = dbo.getDb();
    let myQuery = { _id: ObjectId(req.params.id) };
    await db_connect
      .collection('records')
      .findOne(myQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  } catch (error) {
    next(error);
  }
};

exports.createRecord = async (req, response, next) => {
  try {
    let db_connect =  await dbo.getDb();
    let imageValue = '';
    if (req.body.image) {
      imageValue = req.body.image;
    } else if (req.file === undefined) {
      imageValue = 'placeholder.jpg';
    } else {
      imageValue = req.file.filename;
    }

    // Generate new object based on record properties defined in RECIPE_PROPERTIES array
    //JSON.stringify and JSON.parse are use on front and backend respectively, specifically to handle object data coming from extendedIngredients and analyzedInstructions
    let myObj = {};
    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (RECIPE_PROPERTIES[i] === 'image') {
        myObj['image'] = imageValue;
      } else {
        myObj[RECIPE_PROPERTIES[i]] = JSON.parse(
          req.body[RECIPE_PROPERTIES[i]]
        );
      }
    }

    const newRecord = new Record(myObj);

    db_connect.collection('records').insertOne(newRecord, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
  } catch (error) {
    next(error);
  }
};









