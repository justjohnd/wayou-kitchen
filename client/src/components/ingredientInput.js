import React from 'react';

export default function IngredientInput(props) {

  return (
    <div>
      {props.isVisible && (<div>{props.inputName}: {props.inputValue}</div>)}
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
