import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

import IngredientCreate from './ingredientCreate';
import InstructionCreate from './instructionCreate';
import Input from './input';
import Button from './button';

// This will require to npm install axios
import axios from 'axios';

export default function Create() {
  const [newRecipe, setNewRecipe] = useState(RECIPE_PROPERTIES);

  // data and dataArray contain instructions data
  const [data, setData] = useState('');
  const [dataArray, setDataArray] = useState([]);

  // Ingredients data
  const [ingredient, setIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    id: '',
  });
  const [ingredients, setIngredients] = useState([]);

  // Edit ingredients
  const [editIngredient, setEditIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    id: '',
  });

  // These functions control editing ingredients properties

  //Set ingredient based on data entered into ingredientsCreate fields
  function handleIngredientCallback(e) {
    const { name, value } = e.target;
    setIngredient((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function onEdit(ingredient) {
    setEditIngredient({
      nameClean: ingredient.nameClean,
      amount: ingredient.amount,
      unit: ingredient.unit,
      id: ingredient.id,
    });
  }

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
    const ingredientsClone = [...ingredients];
    const filtered = ingredientsClone.filter((ingredient) => {
      return ingredient.id !== editIngredient.id;
    });
    setIngredients(filtered);

    const includeEditIngredient = [...filtered, editIngredient];
    setIngredients(includeEditIngredient);

    AddIngredientsToRecipe(includeEditIngredient);
    setEditIngredient({
      nameClean: '',
      amount: '',
      unit: '',
      id: '',
    });
  }

  function addIngredientCallback() {
    ingredient.id = uuidv4();
    const ingredientsClone = [...ingredients, ingredient];
    setIngredients(ingredientsClone);
    AddIngredientsToRecipe(ingredientsClone);
    setIngredient({
      nameClean: '',
      amount: '',
      unit: '',
      id: '',
    });
  }

  function AddIngredientsToRecipe(ingredientsParameter) {
    setNewRecipe((prevValue) => {
      return {
        ...prevValue,
        extendedIngredients: ingredientsParameter,
      };
    });
  }

  function deleteIngredientCallback(id) {
    const ingredientsClone = [...ingredients];
    const filtered = ingredientsClone.filter((item, index) => {
      return index !== id;
    });
    setIngredients(filtered);
    AddIngredientsToRecipe(filtered);
  }

  function insertIngredientCallback(idx) {
    setIngredients((prevVal) => {
      const newArray = [...prevVal];
      newArray.splice(idx, 0, {
        nameClean: '',
        amount: '',
        unit: '',
      });
      console.log(idx);
      return newArray;
    });
  }
  //These functions use callbacks from InstructionCreate to set data and dataArray for instructions information

  // Any time dataArray is changed, instructions are updated in NewRecipe
  function AddInstructionToRecipe(arrayParameter) {
    setNewRecipe((prevValue) => {
      return {
        ...prevValue,
        analyzedInstructions: arrayParameter.map((data, index) => ({
          number: index,
          step: data,
        })),
      };
    });
  }

  function handleInstructionCallback(e) {
    setData(e.target.value);
  }

  function addInstructionCallback() {
    setDataArray((prevVal) => [...prevVal, data]);
    const dataArrayClone = [...dataArray, data];
    AddInstructionToRecipe(dataArrayClone);
    setData('');
  }

  console.log(dataArray);
  console.log(newRecipe);

  function editInstructionCallback(index, value) {
    const newArray = [...dataArray];
    newArray.splice(index, 1, value);
    setDataArray(newArray);
    AddInstructionToRecipe(newArray);
  }

  function deleteInstructionCallback(id) {
    const newArray = [...dataArray];
    const filtered = newArray.filter((item, index) => {
      return index !== id;
    });
    setDataArray(filtered);
    AddInstructionToRecipe(filtered);
  }

  function insertInstructionCallback(idx) {
    const newArray = [...dataArray];
    newArray.splice(idx, 0, '');
    setDataArray(newArray);
    AddInstructionToRecipe(newArray);
  }

  function handleData(e) {
    e.preventDefault();
    const { name, value } = e.target;

    setNewRecipe((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  let navigate = useNavigate();

  // This function will handle the submission.
  function handleAddRecipe(e) {
    e.preventDefault();

    // When post request is sent to the create url, axios will add a new record to the database.
    axios
      .post('http://localhost:5000/record/add', newRecipe)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    setNewRecipe(RECIPE_PROPERTIES);

    navigate('/');
  }

  // This following section will display the form that takes the input from the user.
  // render() {
  return (
    <div className="my-5 container">
      <h3>Create New Record</h3>
      <form onSubmit={handleAddRecipe}>
        <Input
          label="Name of the recipe:"
          wrapperClassName="mb-5"
          name="title"
          type="text"
          value={newRecipe.title}
          onChange={(e) => handleData(e)}
        />
        <InstructionCreate
          data={data}
          dataArray={dataArray}
          handleInstructionCallback={handleInstructionCallback}
          addInstructionCallback={addInstructionCallback}
          editInstructionCallback={editInstructionCallback}
          deleteInstructionCallback={deleteInstructionCallback}
          insertInstructionCallback={insertInstructionCallback}
        />
        <IngredientCreate
          ingredient={ingredient}
          ingredients={ingredients}
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
          value={newRecipe.preparationMinutes}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Cooking Minutes:"
          wrapperClassName="mb-5"
          name="cookingMinutes"
          type="text"
          value={newRecipe.cookingMinutes}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Number of Servings:"
          wrapperClassName="mb-5"
          name="servings"
          type="number"
          value={newRecipe.servings}
          onChange={(e) => handleData(e)}
        />
        <Input
          label="Reference Web Page:"
          wrapperClassName="mb-5"
          name="sourceUrl"
          type="text"
          value={newRecipe.sourceUrl}
          onChange={(e) => handleData(e)}
        />
        <Button type="submit" buttonText="Create Recipe" />
      </form>
    </div>
  );
}
