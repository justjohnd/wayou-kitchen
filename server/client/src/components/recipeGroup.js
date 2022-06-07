import RecipesSelected from "./recipesSelected";

function RecipeGroup({ categoryRecords, deleteRecord, privateScreen }) {
  let category;
  if (categoryRecords[0]) {
    category = categoryRecords[0].categories[0].value;
    if (category === undefined) return null;
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  return (
    <div className="ms-3 mb-4">
      <h3>{categoryRecords.length > 0 && category}</h3>
      {categoryRecords && (
        <div>
          <RecipesSelected
            recordArray={categoryRecords}
            deleteRecord={deleteRecord}
            privateScreen={privateScreen}
          />
        </div>
      )}
    </div>
  );
}

export default RecipeGroup;
