import React from 'react';
import Recipe from './recipe';

function RecipeGroup(props) {

  let category;
  if (props.categoryRecords[0]) {
    category = props.categoryRecords[0].categories[0].value;
    category =  category.charAt(0).toUpperCase() + category.slice(1);
  }  

  return (
    <div>
      <h3>{props.categoryRecords.length > 0 && category}</h3>
      <Recipe
      recordArray={props.categoryRecords}
      deleteRecord={props.deleteRecord}
      />
    </div>
  );
}

export default RecipeGroup;
