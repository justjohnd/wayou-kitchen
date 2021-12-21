import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This will require to npm install axios
import axios from 'axios';

export default function UrlSearch() {
  const [url, setUrl] = useState('');
  const [newRecipeFromUrl, setNewRecipeFromUrl] = useState({});

  function handleData(e) {
    const { value } = e.target;

    setUrl(value);
  }

  // // This function will handle getting the recipe from a url
  function handleShowRecipe(e) {
    e.preventDefault();
    
    axios.get(`https://api.spoonacular.com/recipes/extract?url=${url}&apiKey=cb1c464d94f142c08b156c5beddade8b`)
    .then((response) => {
      const allData = response.data;
      setNewRecipeFromUrl({
        title: allData.title,
        extendedIngredients: allData.extendedIngredients,
        preparationMinutes: allData.preparationMinutes,
        cookingMinutes: allData.cookingMinutes,
      });
      setUrl('');
    })
    .catch(error => console.error(`error: ${error}`));
  }

  function handleAddRecipe(e) {
        e.preventDefault();

        const newRecipe = {
          title: newRecipeFromUrl.title,
          extendedIngredients: newRecipeFromUrl.extendedIngredients,
          preparationMinutes: newRecipeFromUrl.preparationMinutes,
          cookingMinutes: newRecipeFromUrl.cookingMinutes,
        };
        
        axios
          .post('http://localhost:5000/record/add', newRecipe)
          .then((res) => console.log(res.data));
  }

    return (
      <div style={{ marginTop: 20 }}>
        <h3>Get Recipe from Url</h3>
        <form onSubmit={handleShowRecipe}>
          <div className="form-group">
            <label>Name of the recipe: </label>
            <input
              name="url"
              type="text"
              className="form-control"
              value={url}
              onChange={(e) => handleData(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Show recipe"
              className="btn btn-primary"
            />
          </div>
        </form>
        <button onClick={handleAddRecipe}>Add to Cookbook</button>
      </div>
    );
}
