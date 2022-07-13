import React from "react";
import Input from "./input";

export default function IngredientInput(props) {
  return (
    <div className="d-inline-block me-4">
      {!props.editable && (
        <Input
          className={props.className}
          disabled="disabled"
          type="text"
          label={props.label}
          placeholder={props.placeholder}
        />
      )}
      {props.editable && (
        <Input
          disabled={!props.editable && "disabled"}
          label={props.label}
          className={props.className}
          name={props.name}
          onChange={props.onChange}
          value={props.value}
          placeholder={props.placeholder}
        />
      )}
    </div>
  );
}
