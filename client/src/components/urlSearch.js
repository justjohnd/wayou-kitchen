import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './input';
import Button from './button';
import axios from 'axios';

export default function UrlSearch(props) {
  const [getUrl, setGetUrl] = useState({
    url: ''
    });
  const [error, setError] = useState('');

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

    try {
      await axios.post('http://localhost:5000/urlSearch', getUrl, {
      headers: {
        'Content-Type': 'application/json',
      }
      });
      console.log("Item added to database");

    } catch(error) {
      props.loaderCallback(false);
      setError(error.response.data.error);
      console.log(error);
      setTimeout(() => {
        setError('');
      }, 5000);
    };

    window.location.reload();
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
