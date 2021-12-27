import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Input from './input';
import Button from './button';

// This will require to npm install axios
import axios from 'axios';

export default function UrlSearch() {
  const [url, setUrl] = useState('');

  let navigate = useNavigate();

  function handleData(e) {
    const { value } = e.target;

    setUrl(value);
  }

  // // This function will handle getting the recipe from a url
  function handleGetRecipe(e) {
    e.preventDefault();
    
    axios.get(`https://api.spoonacular.com/recipes/extract?url=${url}&apiKey=cb1c464d94f142c08b156c5beddade8b`)
    .then((response) => {

      const recipe = {
        title: response.data.title,
        preparationMinutes: response.data.preparationMinutes,
        cookingMinutes: response.data.cookingMinutes,
        readyInMinutes: response.data.readyInMinutes,
        sourceUrl: response.data.sourceUrl,
        image: response.data.image,
        extendedIngredients: response.data.extendedIngredients,
        analyzedInstructions: response.data.analyzedInstructions[0].steps,
        servings: response.data.servings
      };

      axios
        .post('http://localhost:5000/record/add', recipe)
        .then((res) => console.log(res.data))
        .catch((error) => console.error(`error: ${error}`));

      setUrl('');
    })
    .catch(error => console.error(`error: ${error}`));

    navigate('/');
  }

    return (
      <div className="container">
        <form onSubmit={handleGetRecipe}>
          <Input
            fieldWidth=" "
            wrapperClassName="d-inline-block"
            name="url"
            type="text"
            inputClassName="form-control url-input"
            value={url}
            onChange={(e) => handleData(e)}
            placeholder="Enter a URL to get the recipe"
          />
          <Button
            buttonWrapper="d-inline-block"
            className="ms-2"
            type="submit"
            buttonText="Show Recipe"
          />
        </form>
      </div>
    );
}
