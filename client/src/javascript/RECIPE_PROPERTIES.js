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
];

let RECIPE_OBJECT = {};
for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
  RECIPE_OBJECT[RECIPE_PROPERTIES[i]] = '';
}

export default RECIPE_PROPERTIES;
export { RECIPE_OBJECT };


