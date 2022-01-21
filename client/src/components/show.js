import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';
import IngredientGroup from './ingredientGroup';

import { v4 as uuidv4 } from 'uuid';

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
          myObj[RECIPE_PROPERTIES[i]] = response.data[RECIPE_PROPERTIES[i]];
        }

        setShowRecipe(myObj);

        setIngredients(response.data.extendedIngredients);

        setInstructions(response.data.analyzedInstructions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // Create sequence of step numbers that omit headers
  const filtered = instructions.filter(
    (instruction) => instruction.isHeader !== 'true'
  );

  let j = [];
  for (let i = 1; i < filtered.length + 1; i++) {
    j.push(i);
  }

  const numberArray = instructions.map((instruction) => {
    let number;
    if (instruction.isHeader === true) {
      number = 'none';
    } else {
      number = j[0];
      j.shift();
    }
    return number;
  });

  //Find maximum number of possible ingredient groups presented on the page
  const ingredientGroupNumbers = ingredients.map(ingredient => {
    if (!ingredient.group) {
      ingredient.group = 0;
    }
    return ingredient.group;
  });
  const maxGroupNumber = Math.max(...ingredientGroupNumbers);
  const numberOfGroups = maxGroupNumber + 1;

  //Put ingredients in their on groups
  const groupArray = (numberOfGroups) => {
    let newArray = [];
    for (let i = 0; i < numberOfGroups; i++) {
      const group = ingredients.filter((ingredient) => ingredient.group === i);
      newArray.push(group);
    }

    return newArray;
  };

  const ingredientGroups = groupArray(numberOfGroups);

  console.log(ingredientGroups);

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
        {ingredients[0] !== undefined && (
          <section className="ingredients">
            <h2>Ingredients</h2>
            {ingredientGroups.map((group) => (
              <IngredientGroup 
              group={group}
              key={uuidv4()}
              ></IngredientGroup>
            ))}
          </section>
        )}
        <section className="instructions">
          <h2>Instructions</h2>
          {instructions.map((instruction, index) => {
            return (
              <li
                className={instruction.isHeader ? 'instruction-header' : ''}
                key={index}
              >
                {!instruction.isHeader && (
                  <span className="instruction-number">
                    {numberArray[index]}{' '}
                  </span>
                )}
                {instruction.step}
              </li>
            );
          })}
        </section>
      </div>
    </div>
  );
}
