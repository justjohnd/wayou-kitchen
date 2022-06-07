import { default as ReactSelect } from "react-select";
import { components } from "react-select";

import { categories } from "../javascript/categories.js";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default function CategoryDropdown(props) {
  function handleChange(selected) {
    props.categoriesCallback(selected);
  }

  return (
    <span
      className="d-inline-block category-dropdown mb-3"
      data-toggle="popover"
      data-trigger="focus"
      data-content="Please selecet account(s)"
    >
      <ReactSelect
        options={categories}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          Option,
        }}
        onChange={handleChange}
        allowSelectAll={true}
      />
    </span>
  );
}
