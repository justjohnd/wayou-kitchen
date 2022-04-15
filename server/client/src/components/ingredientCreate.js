import { React, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import IngredientEdit from './ingredientEdit';
import Input from './input';
import Button from './button';

export default function IngredientCreate(props) {
  const INGREDIENT = {
    amount: '',
    group: 0,
    nameClean: '',
    id: '',
    unit: '',
  };

  const [ingredient, setIngredient] = useState(INGREDIENT);

  const [editIngredient, setEditIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    group: 0,
    id: '',
  });

  //Set ingredient based on data entered into ingredientsCreate fields
  function sanitizeIngredient(e, stateConstant, setStateConstant) {
    const { name, value } = e.target;

    const ingredientClone = {
      ...stateConstant,
      [name]: value,
    };

    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setStateConstant(ingredientClone);
  }

  function updateRecipeIngredients(data) {
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        extendedIngredients: data,
      };
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredient((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const addIngredient = (ingredient) => {
    ingredient.id = uuidv4();

    const ingredientsClone = [...props.ingredients, ingredient];
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        extendedIngredients: ingredientsClone,
      };
    });
  };

  const editIngredientCallback = (e) => {
    sanitizeIngredient(e, editIngredient, setEditIngredient);
  };

  const showIngredientCallback = (ingredient) => {
    if (!ingredient.id) {
      ingredient.id = uuidv4();
    }

    const ingredientClone = ingredient;
    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setEditIngredient(ingredientClone);
  };

  const onSave = (idx) => {
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((ingredient) => {
      return ingredient.id !== editIngredient.id;
    });

    filtered.splice(idx, 0, editIngredient);
    updateRecipeIngredients(filtered);

    setEditIngredient({
      nameClean: '',
      amount: '',
      unit: '',
      group: 0,
      id: '',
    });
  };

  const deleteIngredient = (e, id) => {
    e.preventDefault();
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((item, index) => {
      return index !== id;
    });
    updateRecipeIngredients(filtered);
  };

  return (
    <div className="form-group mb-5">
      <h4 className="mb-3">Ingredients</h4>
      <section className="recipe-section-wrapper">
        <div className="input-left">
          <div>
            <Input
              label="Ingredient:"
              wrapperClassName="d-sm-inline-block me-4"
              name="nameClean"
              type="text"
              value={ingredient.nameClean}
              onChange={(e) => {
                e.preventDefault();
                handleChange(e);
              }}
            />
            <Input
              label="Amount:"
              wrapperClassName="input-short d-inline-block me-4"
              name="amount"
              type="text"
              value={ingredient.amount}
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder=""
            />
            <Input
              label="Units:"
              wrapperClassName="input-short d-inline-block me-4"
              name="unit"
              type="text"
              value={ingredient.unit}
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder=""
            />
            <div className="d-inline-block me-4">
              <label className="form-label d-block">Group:</label>
              <label>
                <select
                  className="selector-input form-control"
                  onChange={(e) => {
                    handleChange(e);
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
          <Button
            buttonWrapper="btn-right"
            className="ms-sm-2 mt-2 mt-sm-0"
            onClick={(e) => {
              e.preventDefault();
              addIngredient(ingredient);
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
              editIngredientCallback={editIngredientCallback}
              deleteIngredient={deleteIngredient}
            />
          ))}
      </section>
    </div>
  );
}
