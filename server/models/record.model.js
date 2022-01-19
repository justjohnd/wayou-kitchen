const mongoose = require('mongoose');
const { stringify } = require('uuid');

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
    extendedIngredients: [{
    nameClean: String,
    amount: String,
    unit: String,
  }],
    preparationMinutes: {
    type: String,
  },
    cookingMinutes: {
    type: String,
  },
    readyInMinutes: {
    type: String,
  },
    sourceUrl: {
    type: String,
  },
    image: {
    type: String,
  },
    analyzedInstructions: [{number: Number, step: String, isHeader: Boolean}],
  servings: {
    type: String,
  },
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
