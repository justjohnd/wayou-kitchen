import { default as ReactSelect } from "react-select";
import makeAnimated from "react-select/animated";
import { categories } from "../javascript/categories.js";

export default function CategoryDropdown(props) {
  //Select by categories. optionSelected argument is an array containing category objects
  function categoriesCallback(optionSelected) {
    //Put records in their on groups for display
    const categoryTypes = optionSelected.map((category) => category.value);

    if (categoryTypes.length > 0) {
      props.setShowAll(false);
    } else {
      props.setShowAll(true);
    }

    // Filter out all records that match any of the categories selected (based on the records first category), and set state with that array
    const groupArray = () => {
      let newArray = [];
      for (let i = 0; i < categoryTypes.length; i++) {
        const group = props.records.filter((record) => {
          // If index 0 is "other" but index 1 exists, categorized by index 1
          let categories = record.categories;
          if (categories[0].value === "other" && categories[1] !== undefined) {
            if (categories[1].value === categoryTypes[i]) {
              record.mainCat = categoryTypes[i];
              return record;
            }
          }

          if (categories[0].value === categoryTypes[i]) {
            record.mainCat = categoryTypes[i];
            return record;
          }
        });
        if (group !== []) {
          newArray.unshift(group);
        }
      }

      return newArray;
    };

    const groupsToShow = groupArray();
    props.setCategorizedRecords(groupsToShow);
  }

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
      onChange={(selected) => categoriesCallback(selected)}
      value={props.selectedCategories}
      isSearchable
      className="d-inline-block category-dropdown mb-3"
    />
  );
}
