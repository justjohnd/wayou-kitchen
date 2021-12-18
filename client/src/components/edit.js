import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// This will require to npm install axios
import axios from 'axios';

export default function Edit() {
  const [editRecipe, setEditRecipe] = useState({
      recipe_name: '',
      recipe_ingredients: '',
      difficulty_level: '',
      records: [],
  });

    function handleChange(e) {
    const { name, value } = e.target;

    setEditRecipe(prevValue => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }
  
  let params = useParams();
  let navigate = useNavigate();
  // This will get the record based on the id from the database.
  useEffect(() =>  {
    axios
      .get('http://localhost:5000/record/' + params.id)
      .then((response) => {
        setEditRecipe({
          recipe_name: response.data.recipe_name,
          recipe_ingredients: response.data.recipe_ingredients,
          difficulty_level: response.data.difficulty_level,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // This function will handle the submission.
  function handleEditRecipe(e) {
    e.preventDefault();
    const newEditedPerson = {
      recipe_name: editRecipe.recipe_name,
      recipe_ingredients: editRecipe.recipe_ingredients,
      difficulty_level: editRecipe.difficulty_level,
    };
    

    // This will send a post request to update the data in the database.
    axios
      .post(
        'http://localhost:5000/update/' + params.id,
        newEditedPerson
      )
      .then((res) => console.log(res.data));

      navigate('/');
  }

  // This following section will display the update-form that takes the input from the user to update the data.
    return (
      <div>
        <h3 align="center">Update Record</h3>
        <form onSubmit={handleEditRecipe}>
          <div className="form-group">
            <label>Person's Name: </label>
            <input
              name="recipe_name"
              type="text"
              className="form-control"
              value={editRecipe.recipe_name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <label>Position: </label>
            <input
              name="recipe_ingredients"
              type="text"
              className="form-control"
              value={editRecipe.recipe_ingredients}
              onChange={(e) => handleChange(e)}
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
                checked={editRecipe.difficulty_level === 'Easy'}
                onChange={(e) => handleChange(e)}
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
                checked={editRecipe.difficulty_level === 'Moderate'}
                onChange={(e) => handleChange(e)}
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
                checked={editRecipe.difficulty_level === 'Difficult'}
                onChange={(e) => handleChange(e)}
              />
              <label className="form-check-label">Difficult</label>
            </div>
          </div>
          <br />

            <div className="form-group">
              <input
                type="submit"
                value="Update Record"
                className="btn btn-primary"
              />
            </div>
        </form>
      </div>
    );
}
