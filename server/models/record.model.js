const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  //   extendedIngredients: {
  //   type: [String],
  // },
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
  //   analyzedInstructions: {
  //   type: [String],
  // },
  servings: {
    type: String,
  },
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
