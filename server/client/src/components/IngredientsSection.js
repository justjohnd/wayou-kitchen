import { React, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import IngredientEdit from "./IngredientEdit";
import Input from "./input";
import Button from "./Button";

export default function IngredientsSection(props) {
  const INGREDIENT = {
    amount: "",
    group: 0,
    nameClean: "",
    id: "",
    unit: "",
  };

  const [ingredient, setIngredient] = useState(INGREDIENT);

  const [editIngredient, setEditIngredient] = useState({
    nameClean: "",
    amount: "",
    unit: "",
    group: 0,
    id: "",
  });

  //Handle all changes for the new ingredients field
  const handleChangeCreate = (e) => {
    const { name, value } = e.target;
    setIngredient((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  //Add new ingredient to the ingredients list
  const saveIngredientCreate = (ingredient) => {
    ingredient.id = uuidv4();

    const ingredientsClone = [...props.ingredients, ingredient];
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        extendedIngredients: ingredientsClone,
      };
    });
  };

  //These functions control the ingredients list portion of the form
  //Handle changes to ingredient being edited from the ingredients list
  const handleChangeEdit = (e) => {
    const { name, value } = e.target;

    const ingredientClone = {
      ...editIngredient,
      [name]: value,
    };

    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setEditIngredient(ingredientClone);
  };

  //Save any changes to any ingredients in state (not yet to the backend).Triggered by the Save and Delete buttons
  function saveIngredientEdit(data) {
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        extendedIngredients: data,
      };
    });
  }

  // Save button from ingredients list
  const onSave = (idx) => {
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((ingredient) => {
      return ingredient.id !== editIngredient.id;
    });

    filtered.splice(idx, 0, editIngredient);
    saveIngredientEdit(filtered);

    setEditIngredient({
      nameClean: "",
      amount: "",
      unit: "",
      group: 0,
      id: "",
    });
  };

  //Delete button from ingredients list
  const deleteIngredient = (e, id) => {
    e.preventDefault();
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((item, index) => {
      return index !== id;
    });
    saveIngredientEdit(filtered);
  };

  //Saves changes to editIngredient
  const showIngredientCallback = (ingredient) => {
    if (!ingredient.id) {
      ingredient.id = uuidv4();
    }

    const ingredientClone = ingredient;
    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setEditIngredient(ingredientClone);
  };

  return (
    <div className="form-group mb-5">
      <h4 className="mb-3">Ingredients</h4>
      <section className="recipe-section-wrapper">
        <div className="input-left">
          <div className="ingredient-info-wrapper">
            <Input
              label="Ingredient:"
              wrapperClassName="d-sm-inline-block me-sm-4 ingredient-name"
              name="nameClean"
              type="text"
              value={ingredient.nameClean}
              onChange={(e) => {
                e.preventDefault();
                handleChangeCreate(e);
              }}
            />
            <div className="d-sm-flex flex-grow-1">
              <Input
                label="Amount:"
                wrapperClassName="input-short ingredient-info d-inline-block me-4"
                name="amount"
                type="text"
                value={ingredient.amount}
                onChange={(e) => {
                  handleChangeCreate(e);
                }}
                placeholder=""
              />
              <Input
                label="Units:"
                wrapperClassName="input-short ingredient-info d-inline-block me-sm-4"
                name="unit"
                type="text"
                value={ingredient.unit}
                onChange={(e) => {
                  handleChangeCreate(e);
                }}
                placeholder=""
              />
              <div className="d-block d-sm-inline-block me-sm-4">
                <label className="d-block">Group:</label>
                <label>
                  <select
                    className="selector-input form-control"
                    onChange={(e) => {
                      handleChangeCreate(e);
                    }}
                    value={ingredient.group}
                    selected
                    name="group"
                    type="number"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="10">Optional</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <Button
            buttonWrapper="ingredient-btn-wrapper"
            className="ml-md-2 mt-2"
            onClick={(e) => {
              e.preventDefault();
              saveIngredientCreate(ingredient);
              setIngredient(INGREDIENT);
            }}
            buttonText="Add"
          />
        </div>
        {props.ingredients &&
          props.ingredients.map((ingredient, index) => (
            <IngredientEdit
              key={index}
              index={index}
              ingredient={ingredient}
              ingredients={props.ingredients}
              editIngredient={editIngredient}
              showIngredientCallback={showIngredientCallback}
              onSave={onSave}
              handleChangeEdit={handleChangeEdit}
              deleteIngredient={deleteIngredient}
            />
          ))}
      </section>
    </div>
  );
}
