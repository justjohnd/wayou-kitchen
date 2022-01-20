import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';
import RecipeList from './recipeList';

export default function Edit() {
  const [showRecipe, setShowRecipe] = useState({
  title: '',
  preparationMinutes: '',
  cookingMinutes: '',
  readyInMinutes: '',
  sourceUrl: '',
  image: '',
  extendedIngredients: [],
  analyzedInstructions: [],
  servings: '',
});
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  let params = useParams();
  let navigate = useNavigate();
  // This will get the record based on the id from the database.
  useEffect(() => {
    axios
      .get('http://localhost:5000/record/' + params.id)
      .then((response) => {

        let myObj = {};
        for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
            myObj[RECIPE_PROPERTIES[i]] =
              response.data[RECIPE_PROPERTIES[i]];
          }

        setShowRecipe(myObj);

        setIngredients(response.data.extendedIngredients);

        setInstructions(response.data.analyzedInstructions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className="recipe-container container my-5 p-5">
      <section className="d-flex">
        <img
          className="recipe-image"
          src={
            showRecipe.image.slice(0, 4) === 'http'
              ? showRecipe.image
              : '../../images/' + showRecipe.image
          }
        />
        <div className="recipe-header ms-5">
          <h1>{showRecipe.title}</h1>
          <p className="mb-0 pb-0">
            Ready in {showRecipe.readyInMinutes} minutes
          </p>
          <p className="mb-0 pb-0">{showRecipe.servings} servings</p>
          <a
            href={showRecipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-0 pb-0"
          >
            Original Website
          </a>
        </div>
      </section>
      <div className="recipe-wrapper">
        <section className="ingredients">
          <h2>Ingredients</h2>
          {ingredients[0] !== undefined ? ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount ? ingredient.amount : ''} {ingredient.unit ? ingredient.unit : ''} {ingredient.nameClean ? ingredient.nameClean : ''}
            </li>
          )) : ''}
        </section>
        <section className="instructions">
          <h2>Instructions</h2>
          {instructions.map((instruction, index) => (
            <li className={instruction.isHeader ? "instruction-header" : ""} key={index}>
              <span className="instruction-number">{index + 1} </span>
              {instruction.step}
            </li>
          ))}
        </section>
      </div>
    </div>
  );
}
