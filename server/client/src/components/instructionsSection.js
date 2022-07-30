import React, { useState } from "react";
import InstructionEdit from "./instructionEdit";
import TextArea from "./TextArea";
import Button from "./Button";

export default function InstructionsSection(props) {
  // data contains instruction (or header) content
  const [data, setData] = useState("");
  const [header, setHeader] = useState(false);

  // Update recipe whenever there is a change to an instruction (add, edit, insert, or delete)
  function AddInstructionToRecipe(arrayParameter) {
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        analyzedInstructions: arrayParameter.map((data, index) => ({
          number: index,
          step: data.step,
          isHeader: data.isHeader,
        })),
      };
    });
  }

  function addInstruction(header) {
    //Assign header as true or false
    let instructionObject = {
      step: data,
      isHeader: header,
    };

    //Add to recipe
    const instructionsClone = [...props.instructions, instructionObject];
    AddInstructionToRecipe(instructionsClone);
    setData("");
  }

  function editInstructionCallback(index, value, header) {
    const newArray = [...props.instructions];
    newArray.splice(index, 1, {
      number: index,
      step: value,
      isHeader: header,
    });

    AddInstructionToRecipe(newArray);
  }

  function headerCallback(index, header) {
    let instructionClone = props.instructions[index];
    instructionClone.isHeader = header;
    const newArray = [...props.instructions];
    newArray.splice(index, 1, instructionClone);

    AddInstructionToRecipe(newArray);
  }

  function insertInstruction(idx) {
    const newArray = [...props.instructions];
    newArray.splice(idx, 0, {
      step: "",
      isHeader: false,
    });

    AddInstructionToRecipe(newArray);
  }

  function deleteInstruction(e, id) {
    e.preventDefault();
    const newArray = [...props.instructions];
    const filtered = newArray.filter((item, index) => {
      return index !== id;
    });

    AddInstructionToRecipe(filtered);
  }

  function handleHeader() {
    setHeader(!header);
  }

  // Updates field for new instructions only
  function handleInstruction(e) {
    setData(e.target.value);
  }

  return (
    <div className="form-group mb-5">
      <h4 className="mb-3">Instructions</h4>
      <section className="recipe-section-wrapper">
        <div className="d-flex">
          <div className="invisible">0</div>
          <div className="instruction-wrapper">
            <div className="input-left mb-2">
              <div className="ms-sm-2 instruction-input">
                <label className="d-sm-inline-block d-none form-label invisible"></label>
                <TextArea
                  className="form-control textarea"
                  name="instruction"
                  type="text"
                  value={data}
                  callbackFunction={handleInstruction}
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
              className="ms-sm-2 mt-2 mt-sm-0 btn-right "
              buttonWrapper="align-self-start"
              onClick={(e) => {
                e.preventDefault();
                addInstruction(header);
              }}
              buttonText="Add"
            />
          </div>
        </div>
        {props.instructions &&
          props.instructions.map((instruction, index) => (
            <InstructionEdit
              key={index}
              index={index}
              instruction={instruction}
              editInstructionCallback={editInstructionCallback}
              deleteInstruction={deleteInstruction}
              insertInstruction={insertInstruction}
              headerCallback={headerCallback}
            />
          ))}
      </section>
    </div>
  );
}
