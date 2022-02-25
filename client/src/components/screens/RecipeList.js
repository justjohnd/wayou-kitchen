import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../../javascript/categories';
import Recipe from '../recipe';
import RecipeGroup from '../recipeGroup';
import CategoryDropdown from '../categoryDropdown';
import useGetRecords from "../../hooks/useGetRecords";

export default function RecipeList() {
  const records = useGetRecords("/record");
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [recordCategories, setRecordCategories] = useState(null);

  //Select by categories
  function categoriesCallback(optionSelected) {
    setSelectedCategories(optionSelected);
    //Put records in their on groups for display
    const categoryTypes = optionSelected.map((category) => category.value);

    const groupArray = () => {
      let newArray = [];
      for (let i = 0; i < categories.length; i++) {
        const group = records.filter((record) => {
          if (record.categories[0].value === categoryTypes[i]) {
            return record;
          }
        });
        newArray.push(group);
      }

      return newArray;
    }

    const groupsToShow = groupArray();
    setRecordCategories(groupsToShow);
  }

function displayAll() {
  if (selectedCategories === null || selectedCategories.length === 0) {
    return <Recipe recordArray={records} />;
  } 
}

  // This following section will display the table with the records of individuals.
  return (
    <div className="p-3 container disable-while-loading">
      <div className="ms-3">
        <CategoryDropdown
          selectedCategories={selectedCategories}
          categoriesCallback={categoriesCallback}
        ></CategoryDropdown>
      </div>
      <h1 className="mb-4 ms-3">Recipes</h1>
      {displayAll()}
      {recordCategories ? (
        recordCategories.map((categoryRecords, index) => {
          if (categoryRecords !== []) {
            return (
              <RecipeGroup
                key={uuidv4()}
                index={index}
                categoryRecords={categoryRecords}
              />
            );
          }
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}
