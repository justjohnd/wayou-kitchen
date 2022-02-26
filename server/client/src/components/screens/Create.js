import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCreateEdit from '../templateCreateEdit';
import RECIPE_PROPERTIES, { RECIPE_OBJECT } from '../../javascript/RECIPE_PROPERTIES';
import httpAddress from '../../javascript/httpAddress';
import axios from 'axios';

export default function Create(props) {
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [ingredients, setIngredients] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError ] = useState('');
  const pageType = 'Create';
  const changeImage = true;

  const navigate = useNavigate();

  //Set image as a file before sending
  function imageCallback(data) {
    if (data) {
      setImagePreview(URL.createObjectURL(data));
    }

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

  const handleRecipe = async (e) => {
    e.preventDefault();
    // When post request is sent to the create url, axios will add a new record to the database.
    recipe.dateCreated = new Date();
    recipe.userId = localStorage.getItem('userId');

    const formData = new FormData();
    // For File objects (such as image) do not stringify
    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (recipe[RECIPE_PROPERTIES[i]] instanceof File) {
        formData.append(RECIPE_PROPERTIES[i], recipe[RECIPE_PROPERTIES[i]]);
      } else if (RECIPE_PROPERTIES[i] === 'image') {
        //Do not send recipe.image unless an image exists
        if (recipe.image !== "") {
          formData.append('image', recipe.image);
        }
      } else {
        formData.append(
          RECIPE_PROPERTIES[i],
          JSON.stringify(recipe[RECIPE_PROPERTIES[i]])
        );
      }
    }

    try {
      await axios.post(`${httpAddress}/record/add`, formData);
      navigate('/private');
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
        navigate('/login');
      }, 5000);
    }
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
        imagePreview={imagePreview}
        changeImage={changeImage}
        categoriesCallback={categoriesCallback}
      />
    </div>
  );
}
