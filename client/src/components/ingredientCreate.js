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
          props.handleIngredientCallback(e);
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
          props.handleIngredientCallback(e);
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
          props.handleIngredientCallback(e);
        }}
        placeholder=""
      />
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
              onEdit={props.onEdit}
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
