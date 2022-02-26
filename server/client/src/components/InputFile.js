import React from 'react';

export default function InputFile(props) {

  return (
    <div className={`${props.wrapperClassName}`}>
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        name="image"
        className={`form-control ${props.className}`}
        onChange={props.onChange}
      />
    </div>
  );
      }
