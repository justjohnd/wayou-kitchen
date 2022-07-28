import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RECIPE_PROPERTIES from "../../javascript/RECIPE_PROPERTIES";
import httpAddress from "../../javascript/httpAddress";
import IngredientGroup from "../IngredientGroup";

import "./Show.css";

import { v4 as uuidv4 } from "uuid";

// This will require to npm install axios
import axios from "axios";

export default function Show() {
  const [showRecipe, setShowRecipe] = useState({
    title: "",
    preparationMinutes: "",
    cookingMinutes: "",
    readyInMinutes: "",
    sourceUrl: "",
    image: "",
    extendedIngredients: [],
    analyzedInstructions: [],
    servings: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  let params = useParams();
  let navigate = useNavigate();
  // This will get the record based on the id from the database.
  useEffect(() => {
    try {
      const showData = async () => {
        const { data } = await axios.get(`${httpAddress}/record/${params.id}`);

        let myObj = {};
        for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
          myObj[RECIPE_PROPERTIES[i]] = data[RECIPE_PROPERTIES[i]];
        }

        setShowRecipe(myObj);

        setIngredients(data.extendedIngredients);

        setInstructions(data.analyzedInstructions);
      };

      showData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Create sequence of step numbers that omit headers
  const getStepNumbers = (inst) => {
    if (!inst.length) {
      return;
    }

    const filtered = inst.filter(
      (instruction) => instruction.isHeader !== "true"
    );

    let j = [];
    for (let i = 1; i < filtered.length + 1; i++) {
      j.push(i);
    }

    const numberArray = inst.map((instruction) => {
      let number;
      if (instruction.isHeader === true) {
        number = "none";
      } else {
        number = j[0];
        j.shift();
      }
      return number;
    });

    return numberArray;
  };

  const numArray = getStepNumbers(instructions);

  //Ingredient groups section
  let ingredientGroups;
  if (ingredients[0] !== "") {
    //Find maximum number of possible ingredient groups presented on the page
    const ingredientGroupNumbers = ingredients.map((ingredient) => {
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
        const group = ingredients.filter(
          (ingredient) => ingredient.group === i
        );
        newArray.push(group);
      }

      return newArray;
    };

    ingredientGroups = groupArray(numberOfGroups);
  }

  return (
    <div className="show-wrapper">
      <div className="recipe-container container-sm my-sm-5 p-sm-5">
        <section className="d-sm-flex header-section">
          <div className="recipe-image-wrapper">
            <img
              className="recipe-image"
              src={
                showRecipe.image?.slice(0, 4) === "http"
                  ? showRecipe.image
                  : "../images/placeholder.jpg"
              }
            />
          </div>
          <div className="recipe-header">
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
        <section className="d-sm-flex recipe-section">
          {ingredients[0] !== "" && (
            <section className="recipe-ingredients">
              <h2>Ingredients</h2>
              {ingredientGroups.map((group) => (
                <IngredientGroup group={group} key={uuidv4()}></IngredientGroup>
              ))}
            </section>
          )}
          <div className="recipe-instructions">
            <h2>Instructions</h2>
            {instructions.length &&
              instructions.map((instruction, index) => {
                return (
                  <li
                    className={instruction.isHeader ? "instruction-header" : ""}
                    key={index}
                  >
                    {!instruction.isHeader && (
                      <span className="instruction-number">
                        {numArray[index]}{" "}
                      </span>
                    )}
                    {instruction.step}
                  </li>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
