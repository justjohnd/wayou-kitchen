import React from 'react';
import Input from './input';
import '../index.css';

function InstructionEdit(props) {

  return (
    <div>
      <div className="step-number d-inline-block">{props.index + 1}</div>
      <Input
        wrapperClassName="d-inline-block ms-2"
        onChange={(e) => props.editInstruction(props.index, e.target.value)}
        value={props.dataArray[props.index]}
      />
      <button
        className="btn btn-secondary ms-2 d-inline-block mb-1"
        onClick={(e) => {
          props.deleteInstruction(e, props.index);
        }}
      >
        Delete
      </button>
      <button
        className="btn btn-secondary ms-2 d-inline-block mb-1"
        onClick={(e) => props.insertInstruction(e, props.index)}
      >
        Insert Step Above
      </button>
    </div>
  );
}

export default InstructionEdit;
