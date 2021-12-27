import React from 'react';
import Input from './input';
import Button from './button';
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
      <Button
        className="ms-2 mb-1"
        buttonStyle="btn-secondary"
        buttonWrapper="d-inline-block"
        onClick={(e) => {
          props.deleteInstruction(e, props.index);
        }}
        buttonText="Delete"
      />
      <Button
        buttonWrapper="d-inline-block"
        className="ms-2 mb-1"
        buttonStyle="btn-secondary"
        onClick={(e) => props.insertInstruction(e, props.index)}
        buttonText="Insert Step Above"
      />
    </div>
  );
}

export default InstructionEdit;
