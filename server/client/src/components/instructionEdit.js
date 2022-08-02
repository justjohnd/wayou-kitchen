import { useState } from "react";
import TextArea from "./TextArea";
import Button from "./Button";
import "../index.css";

function InstructionEdit(props) {
  const [instructionHeader, setInstructionHeader] = useState(
    props.instruction.isHeader
  );

  function handleHeader() {
    const newHeader = !instructionHeader;
    setInstructionHeader(newHeader);
    props.headerCallback(props.index, newHeader);
  }

  function editInstruction(e) {
    props.editInstructionCallback(
      props.index,
      e.target.value,
      instructionHeader
    );
  }

  return (
    <div className="d-flex">
      <div className="step-number">{props.index + 1}</div>
      <div className="instruction-wrapper">
        <div className="input-left mb-2">
          <div className="ms-2 instruction-input">
            <TextArea
              className="form-control textarea"
              name="instruction"
              type="text"
              value={props.instruction.step}
              callbackFunction={editInstruction}
              placeholder="Start Entering Instructions Here"
            />
          </div>
          <div className="d-inline mx-3 align-self-start">
            <input title="header" type="checkbox" onClick={handleHeader} />
            <label className="mx-1" htmlFor="header">
              Make Header?
            </label>
          </div>
        </div>
        <div className="btn-right">
          <Button
            className="ms-2"
            buttonStyle="btn-secondary"
            buttonWrapper="instruction-btn"
            onClick={(e) => {
              props.deleteInstruction(e, props.index);
            }}
            buttonText="Delete"
          />
          <Button
            buttonWrapper="instruction-btn"
            className="ms-2"
            buttonStyle="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              props.insertInstruction(props.index);
            }}
            buttonText="Insert Step Above"
          />
        </div>
      </div>
    </div>
  );
}

export default InstructionEdit;
