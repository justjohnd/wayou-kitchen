import React, { useState } from "react";
import { Circles } from 'react-loader-spinner';
import { Routes, Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Create from "./components/create";
import Auth from "./components/auth";
import RecipeList from "./components/recipeList";
import Show from "./components/show";

const App = () => {
    const [showLoader, setShowLoader] = useState(false);

    function loaderCallback(data) {
      document.body.classList.add('overlay');
      let links = document.querySelectorAll('.disable-while-loading');
      links.forEach(link => link.classList.add('disabled'));
      setShowLoader(data);
    }

  return (
    <div>
      {showLoader && (
        <div>
          <div className="loader">
            <Circles ariaLabel="loading-indicator" />
          </div>
        </div>
      )}
      <Navbar loaderCallback={loaderCallback} />
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/show/:id" element={<Show />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<RecipeList to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
