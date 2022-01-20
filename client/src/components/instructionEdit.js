import React, { useState } from 'react';
import Input from './input';
import Button from './button';
import '../index.css';

function InstructionEdit(props) {
  const [instructionHeader, setInstructionHeader] = useState(props.dataArray[props.index].isHeader);

  function handleHeader() {
    const newHeader = !instructionHeader;
    setInstructionHeader(newHeader);
    props.headerCallback(props.index, newHeader);
  }

  return (
    <div>
      <div className="step-number d-inline-block">{props.index + 1}</div>
      <Input
        wrapperClassName="d-inline-block ms-2"
        onChange={(e) => props.editInstructionCallback(props.index, e.target.value, instructionHeader)}
        value={props.dataArray[props.index].step}
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
        onClick={(e) => {
          e.preventDefault();
          props.insertInstruction(props.index)
        }}
        buttonText="Insert Step Above"
      />
      <div className="d-inline mx-3">
        <input 
        name="isHeader"
        onChange={handleHeader}
        checked={instructionHeader}
        title="header" 
        type="checkbox" />
        <label htmlFor="header">Make Header?</label>
      </div>
    </div>
  );
}

export default InstructionEdit;
