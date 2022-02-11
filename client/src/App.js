import React, { useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";
import { Routes, Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Create from "./components/create";
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
    const [privateData, setPrivateData] = useState('');

    useEffect(() => {
      if (localStorage.getItem('authToken')) {
        setLoginStatus(true);
        setPrivateData(localStorage.getItem('userId'));
      } else {
        setLoginStatus(false);
        setPrivateData('');
      }
    });

    function loaderCallback(data) {
      document.body.classList.add("overlay");
      let links = document.querySelectorAll(".disable-while-loading");
      links.forEach(link => link.classList.add("disabled"));
      setShowLoader(data);
    }

    function loginStatusCallback(status) {
      setLoginStatus(status);
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
      <Navbar
        loginStatus={loginStatus}
        privateData={privateData}
        loaderCallback={loaderCallback}
      />
      <Routes>
        <Route 
        path="/" 
        element={<RecipeList />} />
        <Route 
        path="/show/:id" 
        element={<Show />} />
        <Route 
        path="/edit/:id" 
        element={<Edit />} />
        <Route
          path="/login"
          element={<LoginScreen loginStatusCallback={loginStatusCallback} />}
        />
        <Route 
        path="/register" 
        element={<RegisterScreen />} />
        <Route
          path="/private"
          element={<PrivateScreen loginStatusCallback={loginStatusCallback} />}
        />
        <Route 
        path="/forgotpassword" 
        element={<ForgotPasswordScreen />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/create"
            element={<Create privateData={privateData} />}
          />
        </Route>
        <Route 
        path="*" 
        element={<RecipeList privateData={privateData} to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
