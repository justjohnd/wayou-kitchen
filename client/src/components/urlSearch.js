import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './input';
import Button from './button';

export default function UrlSearch(props) {
  const [getUrl, setGetUrl] = useState({
    url: ''
    });

  let navigate = useNavigate();

  function handleData(e) {
    const { value } = e.target;
    
    setGetUrl(() => {
      return {
        url: value,
        userId: localStorage.getItem('userId'),
      };
    });
  }

  // // This function will handle getting the recipe from a url
  async function handleGetRecipe(e) {
    e.preventDefault();
    props.loaderCallback(true);

    await fetch('http://localhost:5000/urlSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getUrl),
    })
    .then(() => console.log("Item added to database"))
    .catch((error) => {
      console.error(error);
      return;
    });

    navigate(0);
  }

    return (
      <div className="container">
        <form onSubmit={handleGetRecipe}>
          <Input
            wrapperClassName="d-inline-block"
            name="url"
            type="text"
            className="url-input"
            value={getUrl.url}
            onChange={(e) => handleData(e)}
            placeholder="Enter a URL to get the recipe"
          />
          <Button
            buttonWrapper="d-inline-block"
            buttonStyle="btn-nav"
            className="ms-2 me-5"
            type="submit"
            buttonText="Get from URL"
          />
        </form>
      </div>
    );
}
