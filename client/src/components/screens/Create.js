import React, { useState } from 'react';
import TemplateCreateEdit from '../templateCreateEdit';

import RECIPE_PROPERTIES, { RECIPE_OBJECT } from '../../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

export default function Create(props) {
  const [pageType, setPageType] = useState('Create');
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [ingredients, setIngredients] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [changeImage, setChangeImage] = useState(true);

  //Set image as a file before sending
  function imageCallback(data) {
    setRecipe((prevValue) => {
      return {
        ...prevValue,
        image: data,
      };
    });
  }

  function recipeCallback(data) {
    setRecipe(data);
  }

  function ingredientsCallback(data) {
    setIngredients(data);
  }

  function dataArrayCallback(data) {
    setDataArray(data);
  }

  //Receive selected categories and set to recipe
  function categoriesCallback(optionSelected) {
    setRecipe((prevValue) => {
      return {
        ...prevValue,
        categories: optionSelected,
      };
    });
  }

  function handleRecipe(e) {
    e.preventDefault();
    // When post request is sent to the create url, axios will add a new record to the database.
    recipe.dateCreated = new Date();
    recipe.userId = localStorage.getItem('userId');

    const formData = new FormData();
    // For File objects (such as image) do not stringify
    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (recipe[RECIPE_PROPERTIES[i]] instanceof File) {
        formData.append(RECIPE_PROPERTIES[i], recipe[RECIPE_PROPERTIES[i]]);
      } else {
        formData.append(
          RECIPE_PROPERTIES[i],
          JSON.stringify(recipe[RECIPE_PROPERTIES[i]])
        );
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
        categoriesCallback={categoriesCallback}
      />
    </div>
  );
}
