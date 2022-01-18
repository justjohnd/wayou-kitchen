import React, { useState } from 'react';
import TemplateCreateEdit from './templateCreateEdit';

import RECIPE_PROPERTIES, { RECIPE_OBJECT } from '../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

export default function Create() {
  const [pageType, setPageType] = useState('Create');
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [ingredients, setIngredients] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [changeImage, setChangeImage] = useState(true);

  function recipeCallback(data) {
    setRecipe(data);
  }

  function imageCallback(data) {

    setRecipe((prevValue) => 
    { 
      return {
      ...prevValue, 
      image: data
    }
  });
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

    const formData = new FormData();
    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {

      if (RECIPE_PROPERTIES[i] === 'image') {
        formData.append('image', recipe.image);
      } else {
        formData.append(RECIPE_PROPERTIES[i], JSON.stringify(recipe[RECIPE_PROPERTIES[i]]));
    }
  }

    axios
      .post('http://localhost:5000/record/add', formData)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    setRecipe(RECIPE_OBJECT);
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
        imageCallback={imageCallback}
        changeImage={changeImage}
      />
    </div>
  );
}
