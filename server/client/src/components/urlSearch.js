import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import httpAddress from "../javascript/httpAddress";
import { getWithExpiry } from "../hooks/localStorageWithExpiry";

import Input from "./input";
import Button from "./Button";

import "./navbar.css";

export default function UrlSearch(props) {
  const [getUrl, setGetUrl] = useState({
    url: "",
  });
  const [error, setError] = useState("");

  let navigate = useNavigate();

  function handleData(e) {
    const { value } = e.target;

    setGetUrl(() => {
      return {
        url: value,
        userId: getWithExpiry("userId"),
      };
    });
  }

  // // This function will handle getting the recipe from a url
  async function handleGetRecipe(e) {
    e.preventDefault();

    props.handleClick();

    try {
      props.loaderCallback(true);
      const response = await axios.post(`${httpAddress}/urlSearch`, getUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        setError(response.data.data);
        setTimeout(() => {
          setError("");
          setGetUrl({ url: "" });
        }, 5000);
      }

      //Add another try catch to run after 5 secconds
      //Make an api call to get the record by its id
      //If it is a success turn off the loader and navigate to private

      //Next wrap the above in a while loop
      //The while loop will be controlled by a boolean success variable. A success will end the loop

      props.loaderCallback(false);
      console.log("Response:", response.data);
      navigate("/private");
    } catch (error) {
      props.loaderCallback(false);
      navigate("/private");
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
        setGetUrl({ url: "" });
      }, 5000);
    }
  }

  return (
    <div className="p-0 m-0 container">
      <form onSubmit={handleGetRecipe}>
        <Input
          wrapperClassName="d-sm-inline-block"
          name="url"
          type="text"
          className={error ? "error-message url-input" : "url-input"}
          value={error ? error : getUrl.url}
          onChange={(e) => handleData(e)}
          placeholder={error ? error : "Enter a URL to get the recipe"}
        />
        <Button
          buttonWrapper="d-none d-sm-inline-block"
          buttonStyle="btn-nav"
          className="ms-2"
          type="submit"
          buttonText="Get Recipe"
        />
      </form>
    </div>
  );
}
