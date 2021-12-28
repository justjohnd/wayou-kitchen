import React, { useState } from 'react';
import TemplateCreateEdit from './templateCreateEdit';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

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

  function handleRecipe(e) {
    e.preventDefault();
    // When post request is sent to the create url, axios will add a new record to the database.
    axios
      .post('http://localhost:5000/record/add', recipe)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    setRecipe(RECIPE_PROPERTIES);
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <TemplateCreateEdit
        pageType={pageType}
        handleRecipe={handleRecipe}
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
