import React, { useState } from 'react';
import InstructionEdit from './instructionEdit';
import Input from './input';
import Button from './button';

export default function InstructionCreate(props) {
    const [header, setHeader] = useState(false);

    function deleteInstruction(e, id) {
      e.preventDefault();
      props.deleteInstructionCallback(id);
    }

    function handleHeader() {
      setHeader(!header);
    }

  return (
    <div className="form-group mb-5">
      <h4>Instructions</h4>
      <Input
        wrapperClassName="d-inline-block mb-3"
        labelClassName="d-none"
        name="instruction"
        type="text"
        value={props.data}
        onChange={(e) => props.handleInstructionCallback(e)}
        placeholder="Start Entering Instructions Here"
      />
      <div className="d-inline mx-3">
        <input title="header" type="checkbox" onClick={handleHeader} />
        <label className="mx-1" htmlFor="header">Make Header?</label>
      </div>
      <Button
        className="ms-2 mb-1"
        buttonWrapper="d-inline-block"
        onClick={(e) => {
          e.preventDefault();
          props.addInstructionCallback(header);
        }}
        buttonText="Add"
      />

      <section className="output output-wrapper">
        {props.dataArray &&
          props.dataArray.map((data, index) => (
            <InstructionEdit
              key={index}
              index={index}
              dataArray={props.dataArray}
              editInstructionCallback={props.editInstructionCallback}
              deleteInstruction={deleteInstruction}
              insertInstruction={props.insertInstruction}
              headerCallback={props.headerCallback}
            />
          ))}
      </section>
    </div>
  );

}
