import RecipesSelected from "./RecipesSelected";

function RecipeGroup({ categoryRecords, deleteRecord, privateScreen }) {
  let category = categoryRecords[0]?.mainCat;

  if (category) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  return (
    <div className="ms-3 mb-4">
      <h3>{category}</h3>
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
