import React, { useState } from 'react';
import InstructionEdit from './instructionEdit';
import TextArea from './TextArea';
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
      <h4 className="mb-3">Instructions</h4>
      <section className="recipe-section-wrapper">
        <div className="input-left">
          <div className="input-left mb-0">
            <div className="d-sm-inline-block d-none invisible">0</div>
            <div className="d-sm-inline-block ms-sm-2 instruction-input">
              <label className="d-sm-inline-block d-none form-label invisible"></label>
              <TextArea
                className="form-control textarea"
                name="instruction"
                type="text"
                value={props.data}
                callbackFunction={props.handleInstructionCallback}
                placeholder="Start Entering Instructions Here"
              />
            </div>
            <div className="mt-2 mt-sm-0 d-sm-inline mx-sm-3">
              <input title="header" type="checkbox" onClick={handleHeader} />
              <label className="mx-1" htmlFor="header">
                Make Header?
              </label>
            </div>
          </div>
          <Button
            className="ms-sm-2 mt-2 mt-sm-0 btn-right"
            buttonWrapper="d-inline-block"
            onClick={(e) => {
              e.preventDefault();
              props.addInstructionCallback(header);
            }}
            buttonText="Add"
          />
        </div>
        {props.instructions &&
          props.instructions.map((data, index) => (
            <InstructionEdit
              key={index}
              index={index}
              instructions={props.instructions}
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
