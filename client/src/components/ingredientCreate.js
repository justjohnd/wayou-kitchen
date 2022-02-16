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
      <section className="recipe-section-wrapper pb-0">
        <h4>Ingredients</h4>
        <div className="d-flex justify-content-between">
          <div>
            <Input
              label="Ingredient:"
              wrapperClassName="d-inline-block me-4"
              name="nameClean"
              type="text"
              value={props.ingredient.nameClean}
              onChange={(e) => {
                e.preventDefault();
                props.createIngredientCallback(e);
              }}
            />
            <Input
              label="Amount:"
              wrapperClassName="input-short d-inline-block me-4"
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
              wrapperClassName="input-short d-inline-block me-4"
              name="unit"
              type="text"
              value={props.ingredient.unit}
              onChange={(e) => {
                props.createIngredientCallback(e);
              }}
              placeholder=""
            />
            <div className="d-inline-block me-4">
              <label className="form-label d-block">Group:</label>
              <label>
                <select
                  className="selector-input form-control"
                  onChange={(e) => props.createIngredientCallback(e)}
                  value={props.ingredient.group}
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
            className="ms-2 mb-1"
            onClick={(e) => {
              e.preventDefault();
              props.addIngredientCallback();
            }}
            buttonText="Add"
          />
        </div>
      </section>
      <section className="output recipe-section-wrapper">
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
