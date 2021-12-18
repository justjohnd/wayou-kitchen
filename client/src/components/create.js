import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This will require to npm install axios
import axios from 'axios';

export default function Create() {
  const [newRecipe, setNewRecipe] = useState({
      recipe_name: '',
      recipe_ingredients: '',
      difficulty_level: '',
  });

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
      recipe_name: newRecipe.recipe_name,
      recipe_ingredients: newRecipe.recipe_ingredients,
      difficulty_level: newRecipe.difficulty_level,
    };

    axios
      .post('http://localhost:5000/record/add', newperson)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    setNewRecipe({
      recipe_name: '',
      recipe_ingredients: '',
      difficulty_level: '',
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
              name="recipe_name"
              type="text"
              className="form-control"
              value={newRecipe.recipe_name}
              onChange={e => handleData(e)}
            />
          </div>
          <div className="form-group">
            <label>Ingredients: </label>
            <input
              name="recipe_ingredients"
              type="text"
              className="form-control"
              value={newRecipe.recipe_ingredients}
              onChange={e => handleData(e)}
            />
          </div>
          <div className="form-group">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="difficulty_level"
                id="priorityLow"
                value="Easy"
                checked={newRecipe.difficulty_level === 'Easy'}
                onChange={e => handleData(e)}
              />
              <label className="form-check-label">Easy</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="difficulty_level"
                id="priorityMedium"
                value="Moderate"
                checked={newRecipe.difficulty_level === 'Moderate'}
                onChange={e => handleData(e)}
              />
              <label className="form-check-label">Moderate</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="difficulty_level"
                id="priorityHigh"
                value="Difficult"
                checked={newRecipe.difficulty_level === 'Difficult'}
                onChange={e => handleData(e)}
              />
              <label className="form-check-label">Difficult</label>
            </div>
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
 // }
}
