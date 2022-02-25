const mongoose = require('mongoose');
const { stringify } = require('uuid');

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  dateCreated: {
    type: Date,
    required: true
  },
  extendedIngredients: [
    {
      nameClean: String,
      amount: String,
      unit: String,
      group: Number,
    },
  ],
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
    required: true
  },
  analyzedInstructions: [{ number: Number, step: String, isHeader: Boolean }],
  categories: [{ value: String }],
  servings: {
    type: String,
  },
  userId: {
    type: String
  }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
