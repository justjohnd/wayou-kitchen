import React from 'react';
import Input from './input';

export default function IngredientInput(props) {

  return (
    <div className="d-inline-block me-2">
      {props.isVisible &&
        (<Input
          disabled="disabled"
          type="text"
          fieldWidth="w-100"
          label={props.inputName}
          value={props.inputValue}
        />)}
      {!props.isVisible && (
        <input
          className={props.className}
          name={props.name}
          onChange={props.onChange}
          value={props.value}
        />
      )}
    </div>
  );
      }
