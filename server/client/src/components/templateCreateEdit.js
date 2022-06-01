import React, { useState } from "react";

import IngredientCreate from "./ingredientCreate";
import InstructionCreate from "./instructionCreate";
import Input from "./input";
import InputFile from "./InputFile";
import Button from "./button";
import CategoryDropdown from "./categoryDropdown";

export default function TemplateCreateEdit(props) {
  function handleData(e) {
    e.preventDefault();
    const { name, value } = e.target;

    props.recipeCallback((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  return (
    <div className="my-5 container container-record-form">
      <h3 className="mb-4">{props.pageType} New Record</h3>
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
          {props.pageType === "Edit" ? (
            <div className="mb-5 d-flex">
              <img
                className="recipe-image"
                id="image-preview"
                src={props.imagePreview}
                alt={props.recipe.title}
              />
              <div>
                <Button
                  buttonWrapper="d-inline mx-3"
                  buttonText="Edit Image"
                  onClick={() => props.changeImageCallback()}
                />
                <Button
                  buttonWrapper="d-inline mx-3"
                  buttonText="Remove Image"
                  onClick={() => props.changeImageCallback("remove")}
                />
                {props.changeImage === true && (
                  <InputFile
                    onChange={(e) => props.imageCallback(e.target.files[0])}
                    className="mx-3"
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              className={`mb-5 ${props.imagePreview ? "d-flex" : "w-sm-50"}`}
            >
              {props.imagePreview && (
                <img
                  className="recipe-image"
                  id="image-preview"
                  src={props.imagePreview}
                  alt={props.recipe.title}
                />
              )}
              <InputFile
                onChange={(e) => props.imageCallback(e.target.files[0])}
                className={props.imagePreview && "mx-3"}
              />
            </div>
          )}
        </div>

        <IngredientCreate
          ingredients={props.recipe.extendedIngredients}
          setRecipe={props.setRecipe}
        />
        <InstructionCreate
          recipeCallback={props.recipeCallback}
          instructions={props.instructions}
          instructionsCallback={props.instructionsCallback}
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
