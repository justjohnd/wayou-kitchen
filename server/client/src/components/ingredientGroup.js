import React from 'react';

function IngredientGroup(props) {
  let groupNumber;
  if (props.group[0]) {
    groupNumber = props.group[0].group;
  } else {
    groupNumber = 'No group';
  }

  return (
    <div>
      {groupNumber === 10 && <h4>Optional Ingredients</h4>}
      {props.group.length > 0 && (
        <div className={`group group${groupNumber}`}>
          {props.group.length > 0 &&
            props.group.map((ingredient, index) => {
              {
                return (
                  <li key={index}>
                    {ingredient.amount ? ingredient.amount : ''}{' '}
                    {ingredient.unit ? ingredient.unit : ''}{' '}
                    {ingredient.nameClean ? ingredient.nameClean : ''}
                  </li>
                );
              }
            })}
        </div>
      )}
    </div>
  );
}

export default IngredientGroup;
