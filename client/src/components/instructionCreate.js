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
      <section className="recipe-section-wrapper pb-0">
        <h4>Instructions</h4>
        <div className="input-left">
          <div>
            <div className="d-inline-block invisible">0</div>
            <Input
              wrapperClassName="d-inline-block ms-2 mb-3 instruction-input"
              labelClassName="d-none"
              name="instruction"
              type="text"
              value={props.data}
              onChange={(e) => props.handleInstructionCallback(e)}
              placeholder="Start Entering Instructions Here"
            />
            <div className="d-inline mx-3">
              <input title="header" type="checkbox" onClick={handleHeader} />
              <label className="mx-1" htmlFor="header">
                Make Header?
              </label>
            </div>
          </div>
          <Button
            className="ms-2 btn-right"
            buttonWrapper="d-inline-block"
            onClick={(e) => {
              e.preventDefault();
              props.addInstructionCallback(header);
            }}
            buttonText="Add"
          />
        </div>
      </section>
      <section className="output recipe-section-wrapper">
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
