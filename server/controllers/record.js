const fs = require('fs');

const RECIPE_PROPERTIES = [
  'title',
  'preparationMinutes',
  'cookingMinutes',
  'readyInMinutes',
  'sourceUrl',
  'image',
  'extendedIngredients',
  'analyzedInstructions',
  'servings',
  'categories',
  'dateCreated',
  'userId',
];

// This will help us connect to the database
const dbo = require('../db/conn');

//Import record schema
let Record = require('../models/record.model');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// This is used for editing and deleting records
async function returnDocument(db, query) {
  let returnedDocument = db.collection('records').findOne(query);
  return returnedDocument;
};

//Clean up incoming object. If there is req.file, set it to image, otherwise, req.body.image.
function setObject(reqData) {
  let myObj = {};

  for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
    if (RECIPE_PROPERTIES[i] === 'image') {
      //First, check to see if image is a url
      if (reqData.file) {
        // Replace reqData.file.location with reqData.file.filename if storing images on a local server
        if (reqData.file.location) {
          myObj['image'] = reqData.file.location;
        } else {
          myObj['image'] = reqData.file.filename;
        }
      } else if (!reqData.body.image) {
        myObj['image'] = 'placeholder.jpg';
      } else {
        myObj['image'] = reqData.body.image;
      }

      // Note: if the record does not have a userId, it will not save
    } else {
      myObj[RECIPE_PROPERTIES[i]] = JSON.parse(
        reqData.body[RECIPE_PROPERTIES[i]]
      );
    }
  }

  return myObj;
}

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
    res.json(error);
  }
};

exports.getRecord = async (req, res) => {
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
    res.json(error);
  }
};

exports.addRecord = async (req, res) => {
  try {
    let db_connect =  await dbo.getDb();

    const myObj = setObject(req);
    console.log(myObj);

    const newRecord = new Record(myObj);

    db_connect.collection('records').insertOne(newRecord, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  } catch (error) {
    res.json(error);
  }
};

exports.updateRecord = async (req, res) => {
  try {
    let db_connect = await dbo.getDb();
    let myQuery = { _id: ObjectId(req.params.id) }
    //Get the object in order to compare previous and new image files
    
    const returnedDocument = await returnDocument(db_connect, myQuery);

    const myObj = setObject(req);
    console.log('myObj: ', myObj.image);
    console.log('returnedDocument: ', returnedDocument.image);

    //Remove any previous images saved to the server that have been changed
    if (myObj.image !== returnedDocument.image) {
      let filePathAndName = `./client/public/images/${returnedDocument.image}`;
      if (returnedDocument.image !== 'placeholder.jpg') {
        fs.unlink(filePathAndName, (err) => {
          if (err) console.log('No image found to remove: ', err);
        });
      }
    }

    let newvalues = {
      $set: myObj,
      $currentDate: { lastModified: true },
    };
    db_connect
      .collection('records')
      .updateOne(myQuery, newvalues, function (err, response) {
        if (err) throw err;
        console.log('1 document updated');
        res.json(response);
      });

     } catch (error) {
    res.json(error);
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    let db_connect = await dbo.getDb();
    let myQuery = { _id: ObjectId(req.params.id) };

    returnDocument(db_connect, myQuery).then((returnedDocument) => {
      // Delete image file from server
      let filePathAndName = `./client/public/images/${returnedDocument.image}`;
      if (returnedDocument.image !== 'placeholder.jpg') {
        fs.unlink(filePathAndName, (err) => {
          if (err) console.log(err);
        });
      }
    
      db_connect.collection('records').deleteOne(myQuery, function (err, response) {
        if (err) throw err;
        console.log('1 document deleted');
        res.status(response);
      });
    });
  } catch (error) {
    res.json(error);
  }
};
