import React from 'react';
import InstructionOutput from './instructionOutput';
import Input from './input';

export default function InstructionsInputs(props) {
    function editInstruction(index, value) {
      props.editInstructionCallback(index, value);
    }

    function deleteInstruction(e, id) {
      e.preventDefault();
      props.deleteInstructionCallback(id);
    }

    function insertInstruction(e, idx) {
      e.preventDefault();
      props.insertInstructionCallback(idx);
    }

    function handleKeyUp(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        props.addInstructionCallback();
      }
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
        <button
          className="btn btn-primary d-inline-block ms-2 mb-1"
          onKeyUp={handleKeyUp}
          onClick={(e) => {
            e.preventDefault();
            props.addInstructionCallback();
          }}
        >
          Add
        </button>
      <section className="output output-wrapper">
        {props.dataArray &&
          props.dataArray.map((item, index) => (
            <InstructionOutput
              key={index}
              index={index}
              dataArray={props.dataArray}
              editInstruction={editInstruction}
              deleteInstruction={deleteInstruction}
              insertInstruction={insertInstruction}
            />
          ))}
      </section>
    </div>
  );

}
