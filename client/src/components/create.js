import React, { useState } from 'react';
import TemplateCreateEdit from './templateCreateEdit';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

export default function Create() {
  const [pageType, setPageType] = useState('Create');
  const [recipe, setRecipe] = useState(RECIPE_PROPERTIES);
  const [ingredients, setIngredients] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  function recipeCallback(data) {
    setRecipe(data);
  }

  function ingredientsCallback(data) {
    setIngredients(data);
  }

  function dataArrayCallback(data) {
    setDataArray(data);
  }


  // This following section will display the form that takes the input from the user.
  // render() {
  return (
    <div>
      <TemplateCreateEdit
      pageType={pageType}
      recipe={recipe}
      recipeCallback={recipeCallback}
      ingredients={ingredients}
      ingredientsCallback={ingredientsCallback}
      dataArray={dataArray}
      dataArrayCallback={dataArrayCallback}
      />
    </div>
  );
}
