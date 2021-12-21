import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InstructionsInputs from './instructionsInputs';

// This will require to npm install axios
import axios from 'axios';

export default function Create() {
  const [newRecipe, setNewRecipe] = useState({
      title: '',
      preparationMinutes: '',
      cookingMinutes: '',
      analyzedInstructions: []
  });

  // data and dataArray contain instructions data
    const [data, setData] = useState('');
    const [dataArray, setDataArray] = useState([]);

  //These functions use callbacks from instructionsInputs to set data and dataArray for instructions information
  function handleDataCallback(e) {
    setData(e.target.value);
  }

  function addInstructionCallback() {
    setDataArray((prevVal) => [...prevVal, data]);
    setData('');
  }

  function changeInstructionCallback(index, value) {
          setDataArray((prevVal) => {
            const newArray = [...prevVal];
            newArray.splice(index, 1, value);
            return newArray;
          });
  }

  function deleteInstructionCallback(id) {
          setDataArray((prevItems) => {
            return prevItems.filter((item, index) => {
              return index !== id;
            });
          });
  }

  function insertInstructionCallback(idx) {
        setDataArray((prevVal) => {
          const newArray = [...prevVal];
          newArray.splice(idx, 0, '');
          return newArray;
        });
  }

  function AddInstructionToRecipe() {
    // const analyzedInstructionsValues = instructions.map((instruction, index) => {
    //   return {
    //     number: index,
    //     step: instruction
    //   };
    // });
  }

  function handleData(e) {
    const { name, value } = e.target;

    setNewRecipe(prevValue => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

  let navigate = useNavigate();

  // // This function will handle the submission.
  function handleAddRecipe(e) {
    e.preventDefault();

  //   // When post request is sent to the create url, axios will add a new record(newrecipe) to the database.
    const newperson = {
      title: newRecipe.title,
      preparationMinutes: newRecipe.preparationMinutes,
      cookingMinutes: newRecipe.cookingMinutes,
    };

    axios
      .post('http://localhost:5000/record/add', newperson)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    setNewRecipe({
      title: '',
      preparationMinutes: '',
      cookingMinutes: '',
    });

    navigate('/');
  }

  console.log(dataArray);
  console.log(data);
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
          data = {data}
          dataArray = {dataArray}
          handleDataCallback = {handleDataCallback}
          addInstructionCallback= {addInstructionCallback}
          changeInstructionCallback={changeInstructionCallback}
          deleteInstructionCallback={deleteInstructionCallback}
          insertInstructionCallback={insertInstructionCallback}
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
