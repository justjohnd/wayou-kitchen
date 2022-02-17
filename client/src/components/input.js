import React from 'react';

export default function Input(props) {

  return (
    <div className={`${props.wrapperClassName}`}>
      <label className={`form-label ${props.labelClassName}`}>
        {props.label}
      </label>
      <input
        disabled={props.disabled ? 'disabled' : ''}
        name={props.name}
        type={props.type}
        className={`form-control ${props.className}`}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        accept={props.accept}
      />
    </div>
  );
      }
