import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TemplateCreateEdit from './templateCreateEdit';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

export default function Edit() {
  const [pageType, setPageType] = useState('Edit');
  const [recipe, setRecipe] = useState(RECIPE_PROPERTIES);
  const [ingredients, setIngredients] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  function recipeCallback(data) {
    setRecipe(data);
  }

    function imageCallback(data) {
      setRecipe((prevValue) => {
        return {
          ...prevValue,
          image: data,
        };
      });
    }

  function ingredientsCallback(data) {
    setIngredients(data);
  }

  function dataArrayCallback(data) {
    setDataArray(data);
  }

  let params = useParams();

  // This function will handle the submission.
  function handleRecipe(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', recipe.title);
    formData.append('preparationMinutes', recipe.preparationMinutes);
    formData.append('cookingMinutes', recipe.cookingMinutes);
    formData.append('readyInMinutes', recipe.readyInMinutes);
    formData.append('sourceUrl', recipe.sourceUrl);
    formData.append('image', recipe.image);
    formData.append('extendedIngredients', JSON.stringify(recipe.extendedIngredients));
    formData.append('analyzedInstructions', JSON.stringify(recipe.analyzedInstructions));
    formData.append('servings', recipe.servings);

      // This will send a post request to update the data in the database.
      axios
        .post('http://localhost:5000/update/' + params.id, formData)
        .then((res) => console.log(res.data));
  }

    // This will get the record based on the id from the database.
    useEffect(() => {
      axios
        .get('http://localhost:5000/record/' + params.id)
        .then((response) => {
          setRecipe({
            title: response.data.title,
            preparationMinutes: response.data.preparationMinutes,
            cookingMinutes: response.data.cookingMinutes,
            readyInMinutes: response.data.readyInMinutes,
            sourceUrl: response.data.sourceUrl,
            image: response.data.image,
            extendedIngredients: response.data.extendedIngredients,
            analyzedInstructions: response.data.analyzedInstructions,
            servings: response.data.servings,
          });
          setIngredients(response.data.extendedIngredients);
          const instructions = response.data.analyzedInstructions.map(
            (instruction) => instruction.step
          );
          setDataArray(instructions);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, []);


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
      />
    </div>
  );
}
