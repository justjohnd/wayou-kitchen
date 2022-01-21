import React, { useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import IngredientCreate from './ingredientCreate';
import InstructionCreate from './instructionCreate';
import Input from './input';
import Button from './button';

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

  let navigate = useNavigate();

  // These functions control editing ingredients properties
  //Set ingredient based on data entered into ingredientsCreate fields
  function handleIngredientCallback(e) {
    const { name, value } = e.target;

    const ingredientClone = {
      ...ingredient,
      [name]: value
    }

    const string = ingredientClone.group;
    ingredientClone.group = parseInt(string, 10);

    setIngredient(ingredientClone);
  }

  function onEdit(ingredient) {
    setEditIngredient({
      nameClean: ingredient.nameClean,
      amount: ingredient.amount,
      unit: ingredient.unit,
      group: ingredient.group,
      id: ingredient.id,
    });
  }
  console.log('ingredient', ingredient);
  console.log('editIngredient', editIngredient);

  function editIngredientCallback(e) {
    const { name, value } = e.target;

    setEditIngredient((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function onSave() {
    const ingredientsClone = [...props.ingredients];
    const filtered = ingredientsClone.filter((ingredient) => {
      return ingredient.id !== editIngredient.id;
    });
    props.ingredientsCallback(filtered);

    const includeEditIngredient = [...filtered, editIngredient];
    props.ingredientsCallback(includeEditIngredient);

    AddIngredientsToRecipe(includeEditIngredient);
    setEditIngredient({
      nameClean: '',
      amount: '',
      unit: '',
      group: 0,
      id: '',
    });
  }

  function addIngredientCallback() {
    if (!ingredient.id) {
      ingredient.id = uuidv4();
    }

    const ingredientsClone = [...props.ingredients, ingredient];
    props.ingredientsCallback(ingredientsClone);
    AddIngredientsToRecipe(ingredientsClone);
    setIngredient({
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
    }

    props.dataArrayCallback((prevVal) => [...prevVal, instructionObject]);
    const dataArrayClone = [...props.dataArray, instructionObject];
    AddInstructionToRecipe(dataArrayClone);
    setData('');
  }

  function editInstructionCallback(index, value, header) {
    const newArray = [...props.dataArray];
    newArray.splice(index, 1, 
      {
        number: index,
        step: value,
        isHeader: header
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
      isHeader: false
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
    <div className="my-5 container">
      <h3>{props.pageType} New Record</h3>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          props.handleRecipe(e);
          navigate('/');
        }}
      >
        <Input
          label="Name of the recipe:"
          wrapperClassName="mb-5"
          name="title"
          type="text"
          value={props.recipe.title}
          onChange={(e) => handleData(e)}
        />
        {props.pageType === 'Edit' && (
          <div>
            <img
              className="recipe-image"
              src={
                props.image.slice(0, 4) === 'http'
                  ? props.image
                  : '../../images/' + props.image
              }
            />
            <Button
              buttonWrapper="d-inline mx-3"
              buttonText="Edit Image"
              onClick={() => props.changeImageCallback()}
            ></Button>
            <Button
              buttonWrapper="d-inline mx-3"
              buttonText="Remove Image"
              onClick={() => props.changeImageCallback('remove')}
            ></Button>
          </div>
        )}
        {props.changeImage === true && (
          <Input
            type="file"
            accept=".png, .jpg, .jpeg"
            name="image"
            onChange={(e) => props.imageCallback(e.target.files[0])}
          />
        )}
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
        <IngredientCreate
          ingredient={ingredient}
          ingredients={props.ingredients}
          editIngredient={editIngredient}
          onEdit={onEdit}
          onSave={onSave}
          handleIngredientCallback={handleIngredientCallback}
          addIngredientCallback={addIngredientCallback}
          editIngredientCallback={editIngredientCallback}
          deleteIngredientCallback={deleteIngredientCallback}
          insertIngredientCallback={insertIngredientCallback}
        />
        <Input
          label="Preparation Minutes:"
          wrapperClassName="mb-3"
          name="preparationMinutes"
          type="text"
          value={props.recipe.preparationMinutes}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Cooking Minutes:"
          wrapperClassName="mb-5"
          name="cookingMinutes"
          type="text"
          value={props.recipe.cookingMinutes}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Number of Servings:"
          wrapperClassName="mb-5"
          name="servings"
          type="number"
          value={props.recipe.servings}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Reference Web Page:"
          wrapperClassName="mb-5"
          name="sourceUrl"
          type="text"
          value={props.recipe.sourceUrl}
          onChange={(e) => handleData(e)}
        />
        <Button type="submit" buttonText="Submit" />
      </form>
    </div>
  );
}
