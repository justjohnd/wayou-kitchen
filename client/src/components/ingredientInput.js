import React from 'react';
import Input from './input';

export default function IngredientInput(props) {

  return (
    <div className="d-inline-block me-4">
      {props.isVisible &&
        (<Input
          className={props.className}
          disabled="disabled"
          type="text"
          label={props.inputName + ":"}
          value={props.inputValue}
        />)}
      {!props.isVisible && (
        <Input
          label={props.inputName}
          className={props.className}
          name={props.name}
          onChange={props.onChange}
          value={props.value}
        />
      )}
    </div>
  );
      }
