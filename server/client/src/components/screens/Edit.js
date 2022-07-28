import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TemplateCreateEdit from "../templateCreateEdit";

import RECIPE_PROPERTIES, {
  RECIPE_OBJECT,
} from "../../javascript/RECIPE_PROPERTIES";
import httpAddress from "../../javascript/httpAddress";
import { getWithExpiry } from "../../hooks/localStorageWithExpiry";

// This will require to npm install axios
import axios from "axios";

export default function Edit({ loaderCallback }) {
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(
    "../../images/placeholder.jpg"
  );

  const pageType = "Edit";

  const navigate = useNavigate();

  let params = useParams();

  // This function will handle the submission.
  const handleRecipe = async (e) => {
    e.preventDefault();

    //Formata() object replicates functions of HTML form, but bundles each element in an array. this is necessary to be able to send uploaded files
    const formData = new FormData();

    if (!recipe.dateCreated) {
      recipe.dateCreated = new Date();
    }

    //At minimum, categeory "Other" will always be set if no other categories are set
    !recipe.categories[0] &&
      recipe.categories.push({ value: "other", label: "Other" });

    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (recipe[RECIPE_PROPERTIES[i]] instanceof File) {
        formData.append(RECIPE_PROPERTIES[i], recipe[RECIPE_PROPERTIES[i]]);
      } else if (RECIPE_PROPERTIES[i] === "image") {
        //If an image is entered and then removed, recipe.image will set to undefined. Changing to "", will cause a stock image to automatically load on the backend
        if (recipe.image === "") {
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
      await axios.put(`${httpAddress}/update/${params.id}`, formData);
      setTimeout(() => {
        navigate("/private");
        loaderCallback(false);
      }, 2000);
    } catch (error) {
      loaderCallback(false);
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
        navigate("/login");
      }, 5000);
    }
  };

  // This will get the record based on the id from the database.
  useEffect(() => {
    // Make sure user session hasn't expired
    if (!getWithExpiry("authToken")) {
      navigate("/login");
      setError("Sorry, you are not logged in.");
    }

    try {
      const fetchData = async () => {
        //Destructure the data object payload
        const { data } = await axios.get(`${httpAddress}/record/${params.id}`);

        let myObj = {};

        for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
          // Only set the image. recipe.image will remain undefined until either a new image is loaded or the existing image is removed
          if (RECIPE_PROPERTIES[i] === "image") {
            //The record may or may not have an image property assigned to it
            if (data.image) {
              //Image is set as a url
              setImagePreview(data.image);
            }
          } else {
            myObj[RECIPE_PROPERTIES[i]] = data[RECIPE_PROPERTIES[i]];
          }
        }

        setRecipe(myObj);
      };

      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <TemplateCreateEdit
        pageType={pageType}
        handleRecipe={handleRecipe}
        recipe={recipe}
        setRecipe={setRecipe}
        instructions={recipe.analyzedInstructions}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
    </div>
  );
}
