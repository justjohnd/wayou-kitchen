import React from 'react';
import IngredientEdit from './ingredientEdit';
import Input from './input';
import Button from './button';

export default function IngredientCreate(props) {
    function deleteIngredient(e, id) {
      e.preventDefault();
      props.deleteIngredientCallback(id);
    }

    function insertIngredient(e, idx) {
      e.preventDefault();
      props.insertIngredientCallback(idx);
    }

  return (
    <div className="form-group mb-5">
      <h4>Ingredients</h4>
      <Input
        label="Ingredient:"
        wrapperClassName="d-inline-block"
        fieldWidth="w-25"
        name="nameClean"
        type="text"
        value={props.ingredient.nameClean}
        onChange={(e) => {
          e.preventDefault();
          props.createIngredientCallback(e);
        }}
        placeholder="Enter Ingredient"
      />
      <Input
        label="Amount:"
        wrapperClassName="d-inline-block ms-2"
        fieldWidth="w-25"
        name="amount"
        type="number"
        value={props.ingredient.amount}
        onChange={(e) => {
          props.createIngredientCallback(e);
        }}
        placeholder=""
      />
      <Input
        label="Units:"
        wrapperClassName="d-inline-block ms-2"
        fieldWidth="w-25"
        name="unit"
        type="text"
        value={props.ingredient.unit}
        onChange={(e) => {
          props.createIngredientCallback(e);
        }}
        placeholder=""
      />
      <div className="d-inline-block ms-2">
        <div className="form-label">Group</div>
        <label>
          <select
            className="selector-input"
            onChange={(e) => props.createIngredientCallback(e)}
            value={props.ingredient.group}
            selected
            name="group"
            type="number"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">Optional</option>
          </select>
        </label>
      </div>
      <Button
        buttonWrapper="d-inline-block"
        className="ms-2 mb-1"
        onClick={(e) => {
          e.preventDefault();
          props.addIngredientCallback();
        }}
        buttonText="Add"
      />
      <section className="output output-wrapper">
        {props.ingredients &&
          props.ingredients.map((ingredient, index) => (
            <IngredientEdit
              key={index}
              index={index}
              ingredient={ingredient}
              ingredients={props.ingredients}
              editIngredient={props.editIngredient}
              showIngredientCallback={props.showIngredientCallback}
              onSave={props.onSave}
              editIngredientCallback={props.editIngredientCallback}
              deleteIngredient={deleteIngredient}
              insertIngredient={insertIngredient}
            />
          ))}
      </section>
    </div>
  );
}
