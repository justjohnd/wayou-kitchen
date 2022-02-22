const express = require('express');
const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const API_KEY = process.env.API_KEY;

const RECIPE_PROPERTIES = require('../../client/src/javascript/PROPERTIES_FOR_BACKEND.js');

// urlSearchRoute is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const urlSearchRoute = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

//Import record schema
let Record = require('../models/record.model');
const { CommandSucceededEvent } = require('mongodb');

//Get data from urlSearch
urlSearchRoute.route('/urlSearch').post(async function (req, topResponse, next) {
  try {
    await axios
      .get(
        `https://api.spoonacular.com/recipes/extract?url=${req.body.url}&apiKey=${API_KEY}`
      )
      .then((response) => {
        //Check to see if there is any data available from the API
        if (response.data.analyzedInstructions[0]) {
          // This section will help you create a new record.
          let db_connect = dbo.getDb();
          // Generate new object based on record properties defined in RECIPE_PROPERTIES array
          let myObj = {};

          const instructions = response.data.analyzedInstructions[0].steps;
          const addIsHeader = instructions.map((instruction) => ({
            ...instruction,
            isHeader: false,
          }));

          response.data.categories = [{ value: 'other' }];
          response.data.dateCreated = new Date();
          console.log(req.body.userId);
          response.data.userId = req.body.userId;
          console.log(response.data.userId);

          for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
            if (RECIPE_PROPERTIES[i] === 'analyzedInstructions') {
              myObj.analyzedInstructions = addIsHeader;
            } else {
              myObj[RECIPE_PROPERTIES[i]] = response.data[RECIPE_PROPERTIES[i]];
            }
          }

          const newRecord = new Record(myObj);

          db_connect
            .collection('records')
            .insertOne(newRecord, function (err, res) {
              if (err) throw err;
              topResponse.json(res);
            });
        } else {
          console.log('API call succeeded, but no viable data returned');
        }
      })
      .catch((error) => {
        console.error(`Failed to connect to API: ${error}`);
        return next(new ErrorResponse('Failed to return recipe from URL', 400));
      }); 
  } catch (error) {
    console.log(`Failed to connect with urlSearch route: ${error}`);
    return new ErrorResponse('Failed to connect with urlSearch route', 400);
  }
  });

  module.exports = urlSearchRoute;
