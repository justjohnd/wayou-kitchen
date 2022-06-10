const RECIPE_PROPERTIES = [
  "title",
  "preparationMinutes",
  "cookingMinutes",
  "readyInMinutes",
  "sourceUrl",
  "image",
  "extendedIngredients",
  "analyzedInstructions",
  "servings",
  "categories",
  "dateCreated",
  "userId",
];

let RECIPE_OBJECT = {
  title: "",
  preparationMinutes: "",
  cookingMinutes: "",
  readyInMinutes: "",
  sourceUrl: "",
  image: "",
  extendedIngredients: "",
  analyzedInstructions: "",
  servings: "",
  categories: [],
  dateCreated: "",
  userId: "",
};

export default RECIPE_PROPERTIES;
export { RECIPE_OBJECT };
