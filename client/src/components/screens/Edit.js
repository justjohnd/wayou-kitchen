import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TemplateCreateEdit from '../templateCreateEdit';

import RECIPE_PROPERTIES, { RECIPE_OBJECT } from '../../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

export default function Edit() {
  const [pageType, setPageType] = useState('Edit');
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [ingredients, setIngredients] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [newImage, setNewImage] = useState({ name: 'noImage' });
  const [image, setImage] = useState('');
  const [changeImage, setChangeImage] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function changeImageCallback(data) {
    setChangeImage(true);
    if (data === 'remove') {
      setNewImage({ name: 'noImage' });
      setImage('placeholder.jpg');
    }
  }

  function recipeCallback(data) {
    setRecipe(data);
  }

  function imageCallback(data) {
    setNewImage(data);
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

  let params = useParams();

  console.log('image: ', image);
  console.log('newImage: ', newImage);

  // This function will handle the submission.
  const handleRecipe = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if(!recipe.dateCreated) {
      recipe.dateCreated = new Date();
    }

    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (RECIPE_PROPERTIES[i] === 'image') {
        // First check to seet if image is a url
        if (image.slice(0, 4) === 'http') {
          formData.append('image', image);
        } else if (image !== newImage.name && newImage.name !== 'noImage') {
          formData.append('image', newImage);
        } else {
          formData.append('image', image);
        }
      } else {
        formData.append(
          RECIPE_PROPERTIES[i],
          JSON.stringify(recipe[RECIPE_PROPERTIES[i]])
        );
      }
    }

    // This will send a post{} request to update the data in the database.
    try {
      await axios.post('http://localhost:5000/update/' + params.id, formData);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  }

  // This will get the record based on the id from the database.
  useEffect(() => {
    axios
      .get('http://localhost:5000/record/' + params.id)
      .then((response) => {
        // image will load separately in the image varialbe, apart from other properties in the receipe variable
        let myObj = {};
        for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
          if (RECIPE_PROPERTIES[i] === 'image') {
            setImage(response.data.image);
          } else {
            myObj[RECIPE_PROPERTIES[i]] = response.data[RECIPE_PROPERTIES[i]];
          }
        }

        setRecipe(myObj);

        const ingredientsWithId = response.data.extendedIngredients.map(
          (ingredient) => {
            return {
              ...ingredient,
              id: ingredient.id,
            };
          }
        );

        setIngredients(ingredientsWithId);

        // const instructions = response.data.analyzedInstructions.map(
        //   (instruction) => instruction.step
        // );
        setDataArray(response.data.analyzedInstructions);
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
        image={image}
        imageCallback={imageCallback}
        changeImage={changeImage}
        changeImageCallback={changeImageCallback}
        categoriesCallback={categoriesCallback}
      />
    </div>
  );
}
