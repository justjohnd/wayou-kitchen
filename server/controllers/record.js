const fs = require('fs');

const RECIPE_PROPERTIES = require('../../client/src/javascript/PROPERTIES_FOR_BACKEND.js');

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

exports.getRecord = async (req, res, next) => {
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

exports.addRecord = async (req, response, next) => {
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

exports.updateRecord = async (req, response, next) => {
  try {
        let db_connect = await dbo.getDb();
        let myQuery = { _id: ObjectId(req.params.id) };

        //Get the object in order to compare previous and new image files
        returnDocument(db_connect, myQuery).then((returnedDocument) => {
          let myObj = {};
          for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
            if (RECIPE_PROPERTIES[i] === 'image') {
              //First, check to see if image is a url
              if (req.file) {
                myObj['image'] = req.file.filename;
              } else if (req.body.image.slice(0, 4) === 'http') {
                myObj['image'] = req.body.image;
              } else {
                myObj['image'] = req.body.image;
              }
              // Note: if the record does not have a userId, it will not save
            } else {
              myObj[RECIPE_PROPERTIES[i]] = JSON.parse(
                req.body[RECIPE_PROPERTIES[i]]
              );
            }
          }

          //Remove any previous images saved to the server that have been changed
          if (myObj.image !== returnedDocument.image) {
            let filePathAndName = `../client/public/images/${returnedDocument.image}`;
            if (returnedDocument.image !== 'placeholder.jpg') {
              fs.unlink(filePathAndName, (err) => {
                if (err) console.log(err);
              });
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
  } catch (error) {
    next(error);
  }
};

exports.deleteRecord = async (req, response, next) => {
  try {
    let db_connect = await dbo.getDb();
    let myQuery = { _id: ObjectId(req.params.id) };

    returnDocument(db_connect, myQuery).then((returnedDocument) => {
      // Delete image file from server
      let filePathAndName = `../client/public/images/${returnedDocument.image}`;
      if (returnedDocument.image !== 'placeholder.jpg') {
        fs.unlink(filePathAndName, (err) => {
          if (err) console.log(err);
        });
      }
    
      db_connect.collection('records').deleteOne(myQuery, function (err, obj) {
        if (err) throw err;
        console.log('1 document deleted');
        response.status(obj);
      });
    });
  } catch (error) {
    next(error);
  }
};
