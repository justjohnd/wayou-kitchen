import React, { useState } from "react";
import IngredientInput from "./IngredientInput";
import Button from "./Button";

function IngredientEdit(props) {
  const [editable, setEditable] = useState(false);

  // Either opens the form fields for editing and saves changes to editIngredient. If the Save button is clicked editIngredient is saved to ingredients
  function handleEdit(e) {
    e.preventDefault();
    setEditable(!editable);
    props.showIngredientCallback(props.ingredient);

    if (editable === true) {
      props.onSave(props.index);
    }
  }

  return (
    <div className="input-left">
      <div>
        <IngredientInput
          editable={editable}
          label="Name"
          placeholder={props.ingredient.nameClean}
          className="ingredient"
          name="nameClean"
          onChange={(e) => props.handleChangeEdit(e)}
          value={props.editIngredient.nameClean}
        />
        <IngredientInput
          editable={editable}
          label="Amount"
          placeholder={props.ingredient.amount}
          className="amount input-short"
          name="amount"
          onChange={(e) => props.handleChangeEdit(e)}
          value={props.editIngredient.amount}
        />
        <IngredientInput
          editable={editable}
          label="Unit"
          placeholder={props.ingredient.unit}
          className="unit input-short"
          name="unit"
          onChange={(e) => props.handleChangeEdit(e)}
          value={props.editIngredient.unit}
        />
        {editable && (
          <div className="d-inline-block">
            <label className="form-label d-block">Group:</label>
            <label className="d-inline-block me-2">
              <select
                className="selector-input"
                onChange={(e) => props.handleChangeEdit(e)}
                value={props.editIngredient.group || ""}
                selected
                name="group"
                type="number"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="10">Optional</option>
              </select>
            </label>
          </div>
        )}
        {!editable && (
          <div className="d-inline-block">
            <label className="form-label d-block">Group:</label>
            <label className="d-inline-block me-2">
              <select
                className="selector-input form-control disabled"
                value={props.ingredient.group || ""}
                selected
                name="group"
                type="number"
                disabled="disabled"
              >
                <option value="0">0</option>
                <option value="10">Optional</option>
              </select>
            </label>
          </div>
        )}
      </div>
      <div
        className={
          props.editIngredient.id === props.ingredient.id ||
          props.editIngredient.id === ""
            ? "btn-right"
            : "d-none"
        }
      >
        <Button
          buttonWrapper="d-inline-block"
          className="ms-2"
          onClick={(e) => {
            props.deleteIngredient(e, props.index);
          }}
          buttonText="Delete"
          buttonStyle="btn-secondary"
        />
        <Button
          buttonWrapper="d-inline-block"
          buttonText={editable === false ? "Edit" : "Save"}
          buttonStyle="btn-secondary"
          className="ms-2"
          onClick={(e) => handleEdit(e)}
        />
      </div>
    </div>
  );
}

export default IngredientEdit;
