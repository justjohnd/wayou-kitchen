import IngredientCreate from "./ingredientCreate";
import InstructionsSection from "./instructionsSection";
import Input from "./input";
import InputFile from "./InputFile";
import Button from "./button";
import CategoryDropdown from "./categoryDropdown";

export default function TemplateCreateEdit(props) {
  function handleData(e) {
    e.preventDefault();
    const { name, value } = e.target;

    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  return (
    <div className="my-5 container container-record-form">
      <h3 className="mb-4">{props.pageType} Record</h3>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          props.handleRecipe(e);
        }}
      >
        <Input
          label="Name of the recipe:"
          wrapperClassName="mb-5 form-group"
          labelClassName="form-label-lg"
          className="w-sm-50"
          name="title"
          type="text"
          value={props.recipe.title}
          onChange={(e) => handleData(e)}
        />
        <div className="form-group mb-5">
          <h4 className="mb-3">Image</h4>
          <div className="mb-5 d-flex align-items-end w-sm-50">
            <img
              className="recipe-image small"
              id="image-preview"
              src={props.imagePreview}
              alt={props.recipe.title}
            />
            <InputFile imageCallback={props.imageCallback} className="mx-3" />

            <Button
              buttonWrapper="d-inline mx-3"
              buttonText="Remove Image"
              onClick={() => props.removeImage()}
            />
          </div>
        </div>

        <IngredientCreate
          ingredients={props.recipe.extendedIngredients}
          setRecipe={props.setRecipe}
        />
        <InstructionsSection
          setRecipe={props.setRecipe}
          instructions={props.instructions}
        />
        <div className="mb-5">
          <h4>Categories</h4>
          <CategoryDropdown
            selectedCategories={props.recipe.categories}
            categoriesCallback={props.categoriesCallback}
          ></CategoryDropdown>
        </div>
        <Input
          label="Preparation Minutes:"
          wrapperClassName="mb-5 form-group"
          labelClassName="form-label-lg"
          name="preparationMinutes"
          className="w-sm-50"
          type="text"
          value={props.recipe.preparationMinutes}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Cooking Minutes:"
          wrapperClassName="mb-5 form-group"
          labelClassName="form-label-lg"
          name="cookingMinutes"
          className="w-sm-50"
          type="text"
          value={props.recipe.cookingMinutes}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Number of Servings:"
          wrapperClassName="mb-5 form-group"
          labelClassName="form-label-lg"
          name="servings"
          className="w-sm-50"
          type="number"
          value={props.recipe.servings}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Reference Web Page:"
          wrapperClassName="mb-5 form-group"
          labelClassName="form-label-lg"
          name="sourceUrl"
          className="w-sm-50"
          type="text"
          value={props.recipe.sourceUrl}
          onChange={(e) => handleData(e)}
        />
        <Button type="submit" buttonText="Submit" />
      </form>
    </div>
  );
}
