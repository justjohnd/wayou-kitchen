import React, { useState } from "react";
import IngredientInput from "./IngredientInput";
import IngredientOptionsDropdown from "./IngredientOptionsDropdown";
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
      <div className="ingredient-info-wrapper">
        <IngredientInput
          editable={editable}
          label="Name"
          placeholder={props.ingredient.nameClean}
          className="ingredient-name"
          name="nameClean"
          onChange={(e) => props.handleChangeEdit(e)}
          value={props.editIngredient.nameClean}
        />
        <IngredientInput
          editable={editable}
          label="Amount"
          placeholder={props.ingredient.amount}
          className="ingredient-info input-short"
          name="amount"
          onChange={(e) => props.handleChangeEdit(e)}
          value={props.editIngredient.amount}
        />
        <IngredientInput
          editable={editable}
          label="Unit"
          placeholder={props.ingredient.unit}
          className="ingredient-info input-short"
          name="unit"
          onChange={(e) => props.handleChangeEdit(e)}
          value={props.editIngredient.unit}
        />
        {editable && (
          <IngredientOptionsDropdown
            group={props.editIngredient.group}
            disabled={false}
            handleChangeEdit={props.handleChangeEdit}
            name="group"
          />
        )}
        {!editable && (
          <IngredientOptionsDropdown
            group={props.ingredient.group}
            disabled={true}
            name="group"
          />
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
          className="ml-md-2 me-2 mt-2"
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
          className="ml-md-2 mt-2"
          onClick={(e) => handleEdit(e)}
        />
      </div>
    </div>
  );
}

export default IngredientEdit;
