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

    const formData = new FormData();

    if (!recipe.dateCreated) {
      recipe.dateCreated = new Date();
    }

    if (recipe.categories[0] === undefined) {
      recipe.categories.push({ value: "other", label: "Other" });
    }

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
        const { data } = await axios.get(`${httpAddress}/record/${params.id}`);

        // image will load separately in the image varialbe, apart from other properties in the receipe variable
        let myObj = {};
        for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
          if (RECIPE_PROPERTIES[i] === "image") {
            myObj.image = data.image;

            if (data.image !== null && data.image.slice(0, 4) === "http") {
              setImagePreview(data.image);
            } else {
              setImagePreview("../../images/" + data.image);
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
