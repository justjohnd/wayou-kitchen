import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import IngredientCreate from './ingredientCreate';
import InstructionCreate from './instructionCreate';
import Input from './input';
import InputFile from './InputFile';
import Button from './button';
import CategoryDropdown from './categoryDropdown';

export default function TemplateCreateEdit(props) {
  // data contains instruction (or header) content
  const [data, setData] = useState('');

  // Ingredients data
  const [ingredient, setIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    group: 0,
    id: '',
  });

  // Edit ingredients
  const [editIngredient, setEditIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    group: 0,
    id: '',
  });

  //Ingredients refactor
  // function addIngredientCallback(ingredient) {
  //   ingredient.id = uuidv4();

  //   const ingredientsClone = [...props.ingredients, ingredient];
  //   props.setRecipe((prevValue) => {
  //     return {
  //       ...prevValue,
  //       extendedIngredients: ingredientsClone,
  //     };
  //   });
  // }

  //Set ingredient based on data entered into ingredientsCreate fields
  function sanitizeIngredient(e, stateConstant, setStateConstant) {
    const { name, value } = e.target;

    const ingredientClone = {
      ...stateConstant,
      [name]: value,
    };

    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setStateConstant(ingredientClone);
  }

  function createIngredientCallback(e) {
    sanitizeIngredient(e, ingredient, setIngredient);
  }

  function editIngredientCallback(e) {
    sanitizeIngredient(e, editIngredient, setEditIngredient);
  }

  function showIngredientCallback(ingredient) {
    if (!ingredient.id) {
      ingredient.id = uuidv4();
    }

    const ingredientClone = ingredient;
    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setEditIngredient(ingredientClone);
  }

  function onSave(idx) {
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((ingredient) => {
      return ingredient.id !== editIngredient.id;
    });

    filtered.splice(idx, 0, editIngredient);
    props.ingredientsCallback(filtered);

    AddIngredientsToRecipe(filtered);
    setEditIngredient({
      nameClean: '',
      amount: '',
      unit: '',
      group: 0,
      id: '',
    });
  }

  function AddIngredientsToRecipe(ingredientsParameter) {
    props.recipeCallback((prevValue) => {
      return {
        ...prevValue,
        extendedIngredients: ingredientsParameter,
      };
    });
  }

  function deleteIngredientCallback(id) {
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((item, index) => {
      return index !== id;
    });
    props.ingredientsCallback(filtered);
    AddIngredientsToRecipe(filtered);
  }

  function insertIngredientCallback(idx) {
    props.ingredientsCallback((prevVal) => {
      const newArray = [...prevVal];
      newArray.splice(idx, 0, {
        nameClean: '',
        amount: '',
        unit: '',
        group: 0,
      });
      console.log(idx);
      return newArray;
    });
  }
  //These functions use callbacks from InstructionCreate to set data and dataArray for instructions information

  // Any time dataArray is changed, instructions are updated in recipe
  function AddInstructionToRecipe(arrayParameter) {
    props.recipeCallback((prevValue) => {
      return {
        ...prevValue,
        analyzedInstructions: arrayParameter.map((data, index) => ({
          number: index,
          step: data.step,
          isHeader: data.isHeader,
        })),
      };
    });
  }

  function handleInstructionCallback(e) {
    setData(e.target.value);
  }

  function addInstructionCallback(header) {
    let instructionObject = {
      step: data,
      isHeader: header,
    };

    props.dataArrayCallback((prevVal) => [...prevVal, instructionObject]);
    const dataArrayClone = [...props.dataArray, instructionObject];
    AddInstructionToRecipe(dataArrayClone);
    setData('');
  }

  function editInstructionCallback(index, value, header) {
    const newArray = [...props.dataArray];
    newArray.splice(index, 1, {
      number: index,
      step: value,
      isHeader: header,
    });
    props.dataArrayCallback(newArray);
    AddInstructionToRecipe(newArray);
  }

  function headerCallback(index, header) {
    let instructionClone = props.dataArray[index];
    instructionClone.isHeader = header;
    const newArray = [...props.dataArray];
    newArray.splice(index, 1, instructionClone);
    props.dataArrayCallback(newArray);
    AddInstructionToRecipe(newArray);
  }

  function deleteInstructionCallback(id) {
    const newArray = [...props.dataArray];
    const filtered = newArray.filter((item, index) => {
      return index !== id;
    });
    props.dataArrayCallback(filtered);
    AddInstructionToRecipe(filtered);
  }

  function insertInstruction(idx) {
    const newArray = [...props.dataArray];
    newArray.splice(idx, 0, {
      step: '',
      isHeader: false,
    });
    props.dataArrayCallback(newArray);
    AddInstructionToRecipe(newArray);
  }

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

  // This following section will display the form that takes the input from the user.
  // render() {
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
          {props.pageType === 'Edit' ? (
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
                  onClick={() => props.changeImageCallback('remove')}
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
              className={`mb-5 ${props.imagePreview ? 'd-flex' : 'w-sm-50'}`}
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
                className={props.imagePreview && 'mx-3'}
              />
            </div>
          )}
        </div>

        <IngredientCreate
          ingredient={ingredient}
          ingredients={props.ingredients}
          editIngredient={editIngredient}
          setRecipe={props.setRecipe}
          showIngredientCallback={showIngredientCallback}
          onSave={onSave}
          createIngredientCallback={createIngredientCallback}
          // addIngredientCallback={addIngredientCallback}
          editIngredientCallback={editIngredientCallback}
          deleteIngredientCallback={deleteIngredientCallback}
          insertIngredientCallback={insertIngredientCallback}
        />
        <InstructionCreate
          data={data}
          dataArray={props.dataArray}
          handleInstructionCallback={handleInstructionCallback}
          addInstructionCallback={addInstructionCallback}
          editInstructionCallback={editInstructionCallback}
          deleteInstructionCallback={deleteInstructionCallback}
          insertInstruction={insertInstruction}
          headerCallback={headerCallback}
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
