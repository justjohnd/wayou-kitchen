import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RECIPE_PROPERTIES from '../javascript/RECIPE_PROPERTIES';

// This will require to npm install axios
import axios from 'axios';

export default function Edit() {
  const [showRecipe, setShowRecipe] = useState(RECIPE_PROPERTIES);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  let params = useParams();
  let navigate = useNavigate();
  // This will get the record based on the id from the database.
  useEffect(() => {
    axios
      .get('http://localhost:5000/record/' + params.id)
      .then((response) => {
        setShowRecipe({
          title: response.data.title,
          preparationMinutes: response.data.preparationMinutes,
          cookingMinutes: response.data.cookingMinutes,
          readyInMinutes: response.data.readyInMinutes,
          sourceUrl: response.data.sourceUrl,
          image: response.data.image,
          extendedIngredients: response.data.extendedIngredients,
          analyzedInstructions: response.data.analyzedInstructions,
          servings: response.data.servings
        });

        setIngredients(response.data.extendedIngredients);
        
        const instructions = response.data.analyzedInstructions.map(instruction => instruction.step);
        setInstructions(instructions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div>
      
    </div>
  );
}
