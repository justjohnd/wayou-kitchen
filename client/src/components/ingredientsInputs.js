import React from 'react';
import IngredientDataField from './ingredientDataField';

export default function IngredientsInputs(props) {
    function editIngredient(index, value) {
      props.editIngredientCallback(index, value);
    }

    function deleteIngredient(e, id) {
      e.preventDefault();
      props.deleteIngredientCallback(id);
    }

    function insertIngredient(e, idx) {
      e.preventDefault();
      props.insertIngredientCallback(idx);
    }

  return (
    <div className="form-group">
      <div>
        <label>Ingredient:</label>
        <input
          name="nameClean"
          type="text"
          className="form-control"
          value={props.ingredient.nameClean}
          onChange={(e) => {
            props.handleIngredientCallback(e);
          }}
          placeholder="Enter Ingredient"
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          name="amount"
          type="number"
          className="form-control"
          value={props.ingredient.amount}
          onChange={e => props.handleIngredientCallback(e)}
          placeholder=""
        />
      </div>
      <div>
        <label>Unit:</label>
        <input
          name="unit"
          type="text"
          className="form-control"
          value={props.ingredient.unit}
          onChange={(e) => {
            props.handleIngredientCallback(e);
          }}
          placeholder=""
        />
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          props.addIngredientCallback();
        }}
      >
        Add
      </button>

      <br />
      <br />
      {/* <section className="output">
        {props.ingredients &&
          props.ingredients.map((item, index) => (
            <IngredientDataField
              key={index}
              index={index}
              dataArray={props.ingredients}
              editIngredient={editIngredient}
              deleteIngredient={deleteIngredient}
              insertIngredient={insertIngredient}
            />
          ))}
      </section> */}
    </div>
  );
}
