import { default as ReactSelect } from "react-select";
import makeAnimated from "react-select/animated";
import { categories } from "../javascript/categories.js";

export default function CategoryDropdown(props) {
  function customTheme(theme) {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "#ff7f3f",
        primary: "#77d970",
      },
    };
  }

  return (
    <ReactSelect
      theme={customTheme}
      components={makeAnimated()}
      options={categories}
      isMulti
      onChange={(selected) => props.categoriesCallback(selected)}
      value={props.selectedCategories}
      isSearchable
      className="d-inline-block category-dropdown mb-3"
    />
  );
}
