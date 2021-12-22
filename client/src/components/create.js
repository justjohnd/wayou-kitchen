import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IngredientsInputs from './ingredientsInputs';
import InstructionsInputs from './instructionsInputs';

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
  });
  const [ingredients, setIngredients] = useState([]);

  // Edit ingredients
    const [editIngredient, setEditIngredient] = useState({
      nameClean: '',
      amount: '',
      unit: '',
    });

  // These functions control editing ingredients properties
  function onEdit(ingredient) {
    setEditIngredient({
      nameClean: ingredient.nameClean,
      amount: ingredient.amount,
      unit: ingredient.unit,
    });
  }

  function onSave(e) {
    setIngredients((ingredients) => {
      return ingredients.filter((ingredient) => {
        return ingredient.id !== editIngredient.id;
      });
    })
    setIngredients((ingredients) => {
      return [...ingredients, editIngredient];
    });
    setEditIngredient({});
    e.preventDefault();
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
      setIngredients((prevVal) => [...prevVal, ingredient]);
      setIngredient({
        nameClean: '',
        amount: '',
        unit: '',
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
    <div style={{ marginTop: 20 }}>
      <h3>Create New Record</h3>
      <form onSubmit={handleAddRecipe}>
        <div className="form-group">
          <label>Name of the recipe: </label>
          <input
            name="title"
            type="text"
            className="form-control"
            value={newRecipe.title}
            onChange={(e) => handleData(e)}
          />
        </div>
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
        <div className="form-group">
          <label>Preparation Minutes: </label>
          <input
            name="preparationMinutes"
            type="text"
            className="form-control"
            value={newRecipe.preparationMinutes}
            onChange={(e) => handleData(e)}
          />
        </div>
        <div className="form-group">
          <label>Cooking Minutes: </label>
          <input
            name="cookingMinutes"
            type="text"
            className="form-control"
            value={newRecipe.cookingMinutes}
            onChange={(e) => handleData(e)}
          />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Create recipe"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
