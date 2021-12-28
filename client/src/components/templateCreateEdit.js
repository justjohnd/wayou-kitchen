import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import IngredientCreate from './ingredientCreate';
import InstructionCreate from './instructionCreate';
import Input from './input';
import Button from './button';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

export default function TemplateCreateEdit(props) {

  // data and dataArray contain instructions data
  const [data, setData] = useState('');

  // Ingredients data
  const [ingredient, setIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    id: '',
  });

  // Edit ingredients
  const [editIngredient, setEditIngredient] = useState({
    nameClean: '',
    amount: '',
    unit: '',
    id: '',
  });

  // Based on pageType, determine whether to propagate fields with database data based on id (for edit)
  let params = useParams();
  let navigate = useNavigate();

  if (props.pageType === 'Edit') {
    // This will get the record based on the id from the database.
    // useEffect(() => {
    //   axios
    //     .get('http://localhost:5000/record/' + params.id)
    //     .then((response) => {
    //       props.recipeCallback({
    //         title: response.data.title,
    //         preparationMinutes: response.data.preparationMinutes,
    //         cookingMinutes: response.data.cookingMinutes,
    //         readyInMinutes: response.data.readyInMinutes,
    //         sourceUrl: response.data.sourceUrl,
    //         image: response.data.image,
    //         extendedIngredients: response.data.extendedIngredients,
    //         analyzedInstructions: response.data.analyzedInstructions,
    //         servings: response.data.servings,
    //       });

    //       props.ingredientsCallback(response.data.extendedIngredients);

    //       const instructions = response.data.analyzedInstructions.map(
    //         (instruction) => instruction.step
    //       );
    //       props.dataArrayCallback(instructions);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // }, []);
  }

  // This function will handle the submission.
  function handleRecipe(e) {
    e.preventDefault();

    if (props.pageType === "Edit") {
    // This will send a post request to update the data in the database.
      axios
        .post('http://localhost:5000/update/' + params.id, props.recipe)
        .then((res) => console.log(res.data));
    } else {
      // When post request is sent to the create url, axios will add a new record to the database.
      axios
        .post('http://localhost:5000/record/add', props.recipe)
        .then((res) => console.log(res.data));

      // We will empty the state after posting the data to the database
      props.recipeCallback(RECIPE_PROPERTIES);
  }
    navigate('/');
  }

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
          step: data,
        })),
      };
    });
  }

  function handleInstructionCallback(e) {
    setData(e.target.value);
  }

  function addInstructionCallback() {
    props.dataArrayCallback((prevVal) => [...prevVal, data]);
    const dataArrayClone = [...props.dataArray, data];
    AddInstructionToRecipe(dataArrayClone);
    setData('');
  }

  function editInstructionCallback(index, value) {
    const newArray = [...props.dataArray];
    newArray.splice(index, 1, value);
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

  function insertInstructionCallback(idx) {
    const newArray = [...props.dataArray];
    newArray.splice(idx, 0, '');
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
        onSubmit={handleRecipe}
      >
        <Input
          label="Name of the recipe:"
          wrapperClassName="mb-5"
          name="title"
          type="text"
          value={props.recipe.title}
          onChange={(e) => handleData(e)}
        />
        <InstructionCreate
          data={data}
          dataArray={props.dataArray}
          handleInstructionCallback={handleInstructionCallback}
          addInstructionCallback={addInstructionCallback}
          editInstructionCallback={editInstructionCallback}
          deleteInstructionCallback={deleteInstructionCallback}
          insertInstructionCallback={insertInstructionCallback}
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
