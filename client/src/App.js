import React from "react";

// We use Route in order to define the different routes of our application
import { Routes, Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Create from "./components/create";
import RecipeList from "./components/recipeList";
import UrlSearch from "./components/urlSearch";
import Show from "./components/show";

const App = () => {
  return (
    <div>
      <h1>Wayou Kitchen!</h1>
      <Navbar />
      <UrlSearch />
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/show/:id" element={<Show />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="*" element={<RecipeList to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
