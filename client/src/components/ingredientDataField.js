import React, { useState } from 'react';
import IngredientInput from './ingredientInput';

function IngredientDataField(props) {
  const [isVisible, setIsVisible] = useState(true);

  function handleEdit(e) {
    e.preventDefault(); 
    setIsVisible(!isVisible);
    props.onEdit(props.ingredient);
  }

    function handleSave(e) {
      e.preventDefault();
      setIsVisible(!isVisible);
      props.onSave();
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
      <button
        onClick={(e) => {
          props.deleteIngredient(e, props.index);
        }}
      >
        Delete
      </button>
      <button onClick={(e) => props.insertIngredient(e, props.index)}>
        Insert Step Above
      </button>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default IngredientDataField;
