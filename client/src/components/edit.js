import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// This will require to npm install axios
import axios from 'axios';

export default function Edit() {
  const [editRecipe, setEditRecipe] = useState({
      title: '',
      preparationMinutes: '',
      cookingMinutes: '',
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
          title: response.data.title,
          preparationMinutes: response.data.preparationMinutes,
          cookingMinutes: response.data.cookingMinutes,
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
      title: editRecipe.title,
      preparationMinutes: editRecipe.preparationMinutes,
      cookingMinutes: editRecipe.cookingMinutes,
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
            <label>Recipe: </label>
            <input
              name="title"
              type="text"
              className="form-control"
              value={editRecipe.title}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <label>Preparation Minutes: </label>
            <input
              name="preparationMinutes"
              type="text"
              className="form-control"
              value={editRecipe.preparationMinutes}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <label>Cooking Minutes: </label>
            <input
              name="cookingMinutes"
              type="text"
              className="form-control"
              value={editRecipe.cookingMinutes}
              onChange={(e) => handleChange(e)}
            />
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
