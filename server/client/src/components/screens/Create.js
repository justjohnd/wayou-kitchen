import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import RECIPE_PROPERTIES, {
  RECIPE_OBJECT,
} from "../../javascript/RECIPE_PROPERTIES";
import httpAddress from "../../javascript/httpAddress";
import { getWithExpiry } from "../../hooks/localStorageWithExpiry";

import TemplateCreateEdit from "../templateCreateEdit";

export default function Create({ loaderCallback }) {
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const pageType = "Create";

  const navigate = useNavigate();

  //Convert image upload File into DOMString for instant preview on the page
  // Note that File inputs do not have values, hence recipe image value must be set here
  function imageCallback(data) {
    if (data) {
      setImagePreview(URL.createObjectURL(data));
    } else {
      //Remove image preview if user removes the image
      setImagePreview("");
    }

    setRecipe((prevValue) => {
      return {
        ...prevValue,
        image: data,
      };
    });
  }

  //Receive selected categories and set to recipe
  function categoriesCallback(optionSelected) {
    setRecipe((prevValue) => {
      return {
        ...prevValue,
        categories: optionSelected,
      };
    });
  }

  const handleRecipe = async (e) => {
    e.preventDefault();
    loaderCallback(true);
    // When post request is sent to the create url, axios will add a new record to the database.
    recipe.dateCreated = new Date();
    recipe.userId = getWithExpiry("userId");

    const formData = new FormData();
    // For File objects (such as image) do not stringify
    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (recipe[RECIPE_PROPERTIES[i]] instanceof File) {
        formData.append(RECIPE_PROPERTIES[i], recipe[RECIPE_PROPERTIES[i]]);
      } else if (RECIPE_PROPERTIES[i] === "image") {
        //If an image is entered and then removed, recipe.image will set to undefined. Changing to "", will cause a stock image to automatically load on the backend
        if (recipe.image !== "") {
          formData.append("image", "");
        }
      } else {
        formData.append(
          RECIPE_PROPERTIES[i],
          JSON.stringify(recipe[RECIPE_PROPERTIES[i]])
        );
      }
    }

    try {
      loaderCallback(true);
      await axios.post(`${httpAddress}/record/add`, formData);
      setTimeout(() => {
        navigate("/private");
        loaderCallback(false);
      }, 2000);
    } catch (error) {
      window.scrollTo(0, 0);
      loaderCallback(false);
      setError("We're sorry, something went wrong!");
      setTimeout(() => {
        setError("");
        navigate("/login");
      }, 5000);
    }
  };

  //Make sure user is still logged in, in case they reload the page
  useEffect(() => {
    if (!getWithExpiry("authToken")) {
      navigate("/login");
      setError("Sorry, you are not logged in.");
    }
  }, []);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <TemplateCreateEdit
        pageType={pageType}
        handleRecipe={handleRecipe}
        recipe={recipe}
        setRecipe={setRecipe}
        instructions={recipe.analyzedInstructions}
        imageCallback={imageCallback}
        imagePreview={imagePreview}
        categoriesCallback={categoriesCallback}
      />
    </div>
  );
}
