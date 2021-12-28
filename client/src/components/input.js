import React from 'react';

export default function Input(props) {

  return (
    <div 
    className={`${props.fieldWidth || "w-50"} ${props.wrapperClassName}`}>
        <label className={`form-label ${props.labelClassName}`}>{props.label}</label>
        <input
          disabled={props.disabled ? "disabled" : ""}
          name={props.name}
          type={props.type}
          className={`form-control mb-1 ${props.inputClassName}`}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
      </div>
  );
      }
