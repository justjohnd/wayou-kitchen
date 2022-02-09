import React, { useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";
import { Routes, Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Create from "./components/create";
import Home from "./components/Home";
import RecipeList from "./components/recipeList";
import Show from "./components/show";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from './components/screens/RegisterScreen';
import PrivateRoute from "./components/routing/PrivateRoute";
import PrivateScreen from './components/screens/PrivateScreen';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';

const App = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);

    function loginCallback(status) {
      setLoginStatus(status);
    }

    console.log(loginStatus);

    function loaderCallback(data) {
      document.body.classList.add("overlay");
      let links = document.querySelectorAll(".disable-while-loading");
      links.forEach(link => link.classList.add("disabled"));
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
      <Navbar loginStatus={loginStatus} loginCallback={loginCallback} loaderCallback={loaderCallback} />
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/show/:id" element={<Show />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route
          path="/login"
          element={<LoginScreen loginCallback={loginCallback} />}
        />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/private" element={<PrivateScreen />} />
        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />
        </Route>
        <Route path="*" element={<RecipeList to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
