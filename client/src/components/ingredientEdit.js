import React, { useState } from 'react';
import IngredientInput from './ingredientInput';
import Button from './button';

function IngredientEdit(props) {
  const [isVisible, setIsVisible] = useState(true);

  function handleEdit(e, id) {
    e.preventDefault(); 
    setIsVisible(!isVisible);

    props.onEdit(props.ingredient);

    if (isVisible === false) {
      props.onSave();
    }
  };

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
      <div className={props.activeIngredient === props.ingredient.id || props.activeIngredient === '' ? 'd-inline-block' : 'd-none'}>
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
          onClick={(e) => {
            handleEdit(e);
          }}
        />
      </div>
    </div>
  );
}

export default IngredientEdit;
