import React from "react";

function IngredientOptionsDropdown({ group, disabled }) {
  return (
    <div className="d-block d-sm-inline-block">
      <label className="d-block">Group:</label>
      <label>
        <select
          className="selector-input form-control"
          value={group || ""}
          selected
          name="group"
          type="number"
          disabled={disabled}
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
  );
}

export default IngredientOptionsDropdown;
