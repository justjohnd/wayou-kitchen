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
    <div className="input-left">
      <div className="input-left mb-0">
        <div className="step-number d-inline-block">{props.index + 1}</div>
        <div className="d-inline-block ms-2 instruction-input">
          <TextArea
            className="form-control textarea"
            name="instruction"
            type="text"
            value={props.instruction.step}
            callbackFunction={editInstruction}
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
      <div className="btn-right">
        <Button
          className="ms-2"
          buttonStyle="btn-secondary"
          buttonWrapper="d-inline-block"
          onClick={(e) => {
            props.deleteInstruction(e, props.index);
          }}
          buttonText="Delete"
        />
        <Button
          buttonWrapper="d-inline-block"
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
  );
}

export default InstructionEdit;
