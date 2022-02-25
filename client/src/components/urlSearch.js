import React, { useState } from 'react';
import Input from './input';
import Button from './button';
import axios from 'axios';

export default function UrlSearch(props) {
  const [getUrl, setGetUrl] = useState({
    url: ''
    });
  const [error, setError] = useState('');

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

    try {
      props.loaderCallback(true);
      const response = await axios.post('http://localhost:5000/urlSearch', getUrl, {
      headers: {
        'Content-Type': 'application/json',
      }
      });

      if (!response.data.success) {
        props.loaderCallback(false);
        setError(response.data.data);
        setTimeout(() => {
          setError('');
          setGetUrl({ url: '' });
        }, 5000);
      } else {
        window.location.reload();
      }
    } catch(error) {
      props.loaderCallback(false);
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
        setGetUrl({url: ''});
      }, 5000);
    };
  }

    return (    
      <div className="container">
        <form onSubmit={handleGetRecipe}>
          <Input
            wrapperClassName="d-inline-block"
            name="url"
            type="text"
            className={error ? "error-message url-input" : "url-input" }
            value={error ? error : getUrl.url}
            onChange={(e) => handleData(e)}
            placeholder={error ? error : "Enter a URL to get the recipe" }
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
