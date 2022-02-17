import React, { useState } from 'react';
import InstructionEdit from './instructionEdit';
import Input from './input';
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
            <div className="d-inline-block invisible">0</div>
            <div className="d-inline-block ms-2 instruction-input">
              <label className="form-label invisible"></label>
              <TextArea
                className="form-control textarea"
                name="instruction"
                type="text"
                value={props.data}
                callbackFunction={props.handleInstructionCallback}
                placeholder="Start Entering Instructions Here"
              />
            </div>
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
