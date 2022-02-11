//Note that properties not fetched by the urlSearch API will cause a 500 internal error unless they are assigned prior to the API fetch

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

module.exports = RECIPE_PROPERTIES;
