import React from 'react';

function IngredientDataField(props) {

  return (
    <div>
      <div className="step-number">{props.index + 1}</div>
      <input className="ingredient"
        onChange={(e) => props.editIngredient(props.index, e.target.value)}
        value={props.ingredients[props.index].nameClean}
      />
      <input className="amount"
        onChange={(e) => props.editIngredient(props.index, e.target.value)}
        value={props.ingredients[props.index].amount}
      />
      <input className="unit"
        onChange={(e) => props.editIngredient(props.index, e.target.value)}
        value={props.ingredients[props.index].unit}
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
    </div>
  );
}

export default IngredientDataField;
