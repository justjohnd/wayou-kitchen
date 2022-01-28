import React, { useState } from 'react';
import IngredientInput from './ingredientInput';
import Button from './button';

function IngredientEdit(props) {
  const [isVisible, setIsVisible] = useState(true);

  function handleEdit(e) {
    e.preventDefault(); 
    setIsVisible(!isVisible);
    props.showIngredientCallback(props.ingredient);

    if (isVisible === false) {
      props.onSave(props.index);
    }
  }
  
  return (
    <div>
      <IngredientInput
        isVisible={isVisible}
        inputName="Name"
        inputValue={props.ingredient.nameClean}
        className="ingredient"
        name="nameClean"
        onChange={(e) => props.editIngredientCallback(e)}
        value={props.editIngredient.nameClean}
      />
      <IngredientInput
        isVisible={isVisible}
        inputName="Amount"
        inputValue={props.ingredient.amount}
        className="amount"
        name="amount"
        onChange={(e) => props.editIngredientCallback(e)}
        value={props.editIngredient.amount}
      />
      <IngredientInput
        isVisible={isVisible}
        inputName="Unit"
        inputValue={props.ingredient.unit}
        className="unit"
        name="unit"
        onChange={(e) => props.editIngredientCallback(e)}
        value={props.editIngredient.unit}
      />
      {!isVisible && (
        <div className="d-inline-block">
          <div className="form-label">Group</div>
        <label className="d-inline-block me-2">
          <select
            className="selector-input"
            onChange={(e) => props.editIngredientCallback(e)}
            value={props.editIngredient.group || ''}
            selected
            name="group"
            type="number"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="10">Optional</option>
          </select>
        </label>
        </div>
      )}
      {isVisible && (
        <div className="d-inline-block">
          <div className="form-label">Group</div>
          <label className="d-inline-block me-2">
            <select
              className="selector-input disabled"
              value={props.ingredient.group || ''}
              selected
              name="group"
              type="number"
              disabled="disabled"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="10">Optional</option>
            </select>
          </label>
        </div>
      )}
      <div
        className={
          props.editIngredient.id === props.ingredient.id ||
          props.editIngredient.id === ''
            ? 'd-inline-block'
            : 'd-none'
        }
      >
        <Button
          buttonWrapper="d-inline-block"
          className="ms-2 mb-1"
          onClick={(e) => {
            props.deleteIngredient(e, props.index);
          }}
          buttonText="Delete"
          buttonStyle="btn-secondary"
        />
        <Button
          buttonWrapper="d-inline-block"
          buttonText={isVisible === true ? 'Edit' : 'Save'}
          buttonStyle="btn-secondary"
          className="ms-2 mb-1"
          onClick={(e) => handleEdit(e)}
        />
      </div>
    </div>
  );
}

export default IngredientEdit;
