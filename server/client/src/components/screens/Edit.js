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

export default function Edit(props) {
  const [pageType, setPageType] = useState("Edit");
  const [recipe, setRecipe] = useState(RECIPE_OBJECT);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [newImage, setNewImage] = useState({ name: "noImage" });
  const [image, setImage] = useState("");
  const [changeImage, setChangeImage] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  function changeImageCallback(data) {
    setChangeImage(true);
    if (data === "remove") {
      setNewImage({ name: "noImage" });
      setImagePreview("../../images/placeholder.jpg");
      setImage("placeholder.jpg");
      setChangeImage(false);
    }
  }

  // Triggered by image input field
  function imageCallback(data) {
    setNewImage(data);
    if (data) {
      setImagePreview(URL.createObjectURL(data));
    }
  }

  function instructionsCallback(data) {
    setInstructions(data);
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

  let params = useParams();

  // This function will handle the submission.
  const handleRecipe = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (!recipe.dateCreated) {
      recipe.dateCreated = new Date();
    }

    for (let i = 0; i < RECIPE_PROPERTIES.length; i++) {
      if (RECIPE_PROPERTIES[i] === "image") {
        //Various edge cases included here, including possiblity of a null value coming from the database, or a local server being used
        if (!image) {
          formData.append("image", newImage);
        } else if (image !== newImage.name && newImage.name !== "noImage") {
          formData.append("image", newImage);
        } else {
          formData.append("image", image);
        }
      } else {
        formData.append(
          RECIPE_PROPERTIES[i],
          JSON.stringify(recipe[RECIPE_PROPERTIES[i]])
        );
      }
    }

    // This will send a post{} request to update the data in the database.
    try {
      props.loaderCallback(true);
      await axios.post(`${httpAddress}/update/${params.id}`, formData);
      setTimeout(() => {
        navigate("/private");
        props.loaderCallback(false);
      }, 2000);
    } catch (error) {
      props.loaderCallback(false);
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
            setImage(data.image);

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

        const ingredientsWithId = data.extendedIngredients.map((ingredient) => {
          return {
            ...ingredient,
            id: ingredient.id,
          };
        });

        setIngredients(ingredientsWithId);
        setInstructions(data.analyzedInstructions);
      };

      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <TemplateCreateEdit
        pageType={pageType}
        handleRecipe={handleRecipe}
        recipe={recipe}
        setRecipe={setRecipe}
        instructions={instructions}
        instructionsCallback={instructionsCallback}
        image={image}
        imagePreview={imagePreview}
        imageCallback={imageCallback}
        changeImage={changeImage}
        changeImageCallback={changeImageCallback}
        categoriesCallback={categoriesCallback}
      />
    </div>
  );
}
