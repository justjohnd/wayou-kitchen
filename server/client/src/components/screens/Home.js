import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import useGetRecords from "../../hooks/useGetRecords";

import RecipesSelected from "../RecipesSelected";
import RecipeGroup from "../recipeGroup";
import CategoryDropdown from "../categoryDropdown";

export default function Home({ loaderCallback }) {
  const records = useGetRecords("/record");
  const [showAll, setShowAll] = useState(true);
  const [categorizedRecords, setCategorizedRecords] = useState(null);

  //Select by categories. optionSelected argument is an array containing category objects
  function categoriesCallback(optionSelected) {
    //Put records in their on groups for display
    const categoryTypes = optionSelected.map((category) => category.value);

    if (categoryTypes.length > 0) {
      setShowAll(false);
    } else {
      setShowAll(true);
    }

    // Filter out all records that match any of the categories selected (based on the records first category), and set state with that array
    const groupArray = () => {
      let newArray = [];
      for (let i = 0; i < categoryTypes.length; i++) {
        const group = records.filter((record) => {
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
    setCategorizedRecords(groupsToShow);
  }

  useEffect(() => {
    loaderCallback(true);
    setTimeout(() => {
      loaderCallback(false);
    }, 1000);
  }, [categorizedRecords]);

  return (
    <div className="p-3 container disable-while-loading">
      <div>
        <CategoryDropdown
          categoriesCallback={categoriesCallback}
        ></CategoryDropdown>
      </div>

      {showAll ? (
        <div>
          <h1 className="mb-4">Recently Added</h1>
          <RecipesSelected showAll={showAll} recordArray={records} />
        </div>
      ) : categorizedRecords ? (
        <>
          {categorizedRecords.map((categoryRecords, index) => {
            return (
              <div key={uuidv4()}>
                <RecipeGroup
                  index={index}
                  showAll={showAll}
                  categoryRecords={categoryRecords}
                />
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
