import { useState } from "react";

export default function useRecordsByCategory(records, optionSelected) {
  const [showAll, setShowAll] = useState(true);

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
  return [groupsToShow, showAll];
}
