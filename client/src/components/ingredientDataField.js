import React, { useState } from 'react';

function IngredientDataField(props) {
  const [isVisible, setIsVisible] = useState(true);

  function handleEdit(e) {
    e.preventDefault(); 
    setIsVisible(false);
    props.onEdit(props.ingredient);
  }

    function handleSave(e) {
      e.preventDefault();
      setIsVisible(false);
      props.onSave();
    }

  return (
    <div>
      <div>Name: {props.ingredient.nameClean}</div>
      <input
        className="ingredient"
        name="nameClean"
        onChange={(e) => props.editIngredientCallback(e)}
        value={props.editIngredient.nameClean}
      />
      <div>Name: {props.ingredient.amount}</div>
      <input
        className="amount"
        name="amount"
        onChange={(e) => props.editIngredientCallback(e)}
        value={props.editIngredient.amount}
      />
      <div>Name: {props.ingredient.unit}</div>
      <input
        className="unit"
        name="unit"
        onChange={(e) =>
          props.editIngredientCallback(e)
        }
        value={props.ingredient.unit}
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

      // <button
      //   onClick={
      //     !props.onEdit
      //       ? props.onEdit(props.ingredient)
      //       : props.onSave(props.ingredient)
      //   }
      // >
      //   {!props.onEdit ? 'Edit' : 'Save'}
      // </button>;
