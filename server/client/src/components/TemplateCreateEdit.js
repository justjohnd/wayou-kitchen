import IngredientsSection from "./IngredientsSection";
import InstructionsSection from "./instructionsSection";
import Input from "./input";
import InputFile from "./InputFile";
import Button from "./Button";
import CatDropCreateEdit from "./CatDropCreateEdit";

import "./TemplateCreateEdit.css";

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

  //Convert image upload File into DOMString for instant preview on the page
  // Note that File inputs do not have values, hence recipe image value must be set here
  function imageCallback(data) {
    if (data === undefined) return;

    props.setImagePreview(URL.createObjectURL(data));

    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        image: data,
      };
    });
  }

  function removeImage() {
    //Remove image preview if user removes the image
    props.setImagePreview("../../images/placeholder.jpg");
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        image: "",
      };
    });
  }

  //Receive selected categories and set to recipe
  function categoriesCallback(optionSelected) {
    props.setRecipe((prevValue) => {
      return {
        ...prevValue,
        categories: optionSelected,
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
          <div className="mb-5 d-sm-flex align-items-end w-sm-50">
            <img
              className="recipe-image small mb-3 mb-sm-0"
              id="image-preview"
              src={props.imagePreview}
              alt={props.recipe.title}
            />
            <div className="image-button-wrapper">
              <InputFile
                imageCallback={imageCallback}
                wrapperClassName="image-button mx-sm-3"
              />

              <Button
                className="mt-sm-2 image-button"
                buttonWrapper="d-inline mx-sm-3"
                buttonText="Remove Image"
                onClick={() => removeImage()}
              />
            </div>
          </div>
        </div>

        <IngredientsSection
          ingredients={props.recipe.extendedIngredients}
          setRecipe={props.setRecipe}
        />
        <InstructionsSection
          setRecipe={props.setRecipe}
          instructions={props.instructions}
        />
        <div className="mb-5">
          <h4>Categories</h4>
          <CatDropCreateEdit
            selectedCategories={props.recipe.categories}
            categoriesCallback={categoriesCallback}
          ></CatDropCreateEdit>
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
