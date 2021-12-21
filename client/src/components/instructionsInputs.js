import React, { useState } from 'react';
import DataField from './dataField';

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

  return (
    <div className="form-group">
      <label>Instructions: </label>
      <input
        name="instruction"
        type="text"
        className="form-control"
        value={props.data}
        onChange={ e => {props.handleInstructionCallback(e);}}
        placeholder="Start Entering Instructions Here"
      />
        <button onClick={e => {
          e.preventDefault();
          props.addInstructionCallback();
        }}>Add</button>

      <br />
      <br />
      <section className="output">
        {props.dataArray &&
          props.dataArray.map((item, index) => (
            <DataField
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
