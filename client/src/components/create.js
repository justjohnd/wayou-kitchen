import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import IngredientsInputs from './ingredientsInputs';
import InstructionsInputs from './instructionsInputs';
import Input from './input';

// This will require to npm install axios
import axios from 'axios';

export default function Create() {
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    preparationMinutes: '',
    cookingMinutes: '',
    readyInMinutes: '',
    sourceUrl: '',
    image: '',
    extendedIngredients: [],
    analyzedInstructions: [],
  });

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
  function onEdit(ingredient) {
    setEditIngredient({
      nameClean: ingredient.nameClean,
      amount: ingredient.amount,
      unit: ingredient.unit,
      id: ingredient.id
    });
  }

  function onSave() {
    setIngredients((ingredients) => {
      return ingredients.filter((ingredient) => {
        return ingredient.id !== editIngredient.id;
      });
    })
    setIngredients((ingredients) => {
      return [...ingredients, editIngredient];
    });
    
    setEditIngredient({
      nameClean: '',
      amount: '',
      unit: '',
      id: '',
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

  console.log(ingredients);

  //These functions are for use in setting the ingredients data
    function handleIngredientCallback(e) {
      const { name, value } = e.target;

      setIngredient((prevValue) => {
        return {
          ...prevValue,
          [name]: value,
        };
      });
    }

    function addIngredientCallback() {
      ingredient.id = uuidv4();
      setIngredients((prevVal) => [...prevVal, ingredient]);
      setIngredient({
        nameClean: '',
        amount: '',
        unit: '',
        id: ''
      });
    }

      function deleteIngredientCallback(id) {
        setIngredients((prevItems) => {
          return prevItems.filter((item, index) => {
            return index !== id;
          });
        });
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

  //These functions use callbacks from instructionsInputs to set data and dataArray for instructions information

  // Any time dataArray is changed, instructions are updated in NewRecipe
  function AddInstructionToRecipe() {
    setNewRecipe((prevValue) => {
      return {
        ...prevValue,
        analyzedInstructions: dataArray.map((data, index) => ({
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
    AddInstructionToRecipe();
    setData('');
  }

  function editInstructionCallback(index, value) {
    setDataArray((prevVal) => {
      const newArray = [...prevVal];
      newArray.splice(index, 1, value);
      return newArray;
    });
    AddInstructionToRecipe();
  }

  function deleteInstructionCallback(id) {
    setDataArray((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
    AddInstructionToRecipe();
  }

  function insertInstructionCallback(idx) {
    setDataArray((prevVal) => {
      const newArray = [...prevVal];
      newArray.splice(idx, 0, '');
      return newArray;
    });
    AddInstructionToRecipe();
  }

  function handleData(e) {
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
    setNewRecipe({
      title: '',
      preparationMinutes: '',
      cookingMinutes: '',
    });

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
        <InstructionsInputs
          data={data}
          dataArray={dataArray}
          handleInstructionCallback={handleInstructionCallback}
          addInstructionCallback={addInstructionCallback}
          editInstructionCallback={editInstructionCallback}
          deleteInstructionCallback={deleteInstructionCallback}
          insertInstructionCallback={insertInstructionCallback}
        />
        <IngredientsInputs
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
          label="Cooking Minutes: "
          wrapperClassName="mb-5"
          name="cookingMinutes"
          type="text"
          value={newRecipe.cookingMinutes}
          onChange={(e) => handleData(e)}
        />
        <button type="submit" className="btn btn-primary">
          Create Recipe
        </button>
      </form>
    </div>
  );
}
