import React from 'react';
import Recipe from './recipe';

function RecipeGroup(props) {
  const categoryName = props.categoryTypes[props.index];
  const capitalizedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div>
      <h3>{props.categoryRecords.length > 0 && capitalizedName}</h3>
      <Recipe
      recordArray={props.categoryRecords}
      deleteRecord={props.deleteRecord}
      />
    </div>
  );
}

export default RecipeGroup;
