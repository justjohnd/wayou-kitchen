import React, { useState } from "react";
import { Circles } from "react-loader-spinner";
import { Routes, Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/screens/Edit";
import Create from "./components/screens/Create";
import RecipeList from "./components/screens/RecipeList";
import Show from "./components/screens/Show";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import PrivateRoute from "./components/routing/PrivateRoute";
import PrivateScreen from "./components/screens/PrivateScreen";
import ForgotPassword from "./components/screens/ForgotPassword";

const App = () => {
  const [showLoader, setShowLoader] = useState(false);

  //Loader
  function loaderCallback(data) {
    let links = document.querySelectorAll(".disable-while-loading");
    if (data === true) {
      // document.body.classList.add('overlay');
      links.forEach((link) => link.classList.add("disabled"));
      setShowLoader(true);
    } else {
      // document.body.classList.remove('overlay');
      links.forEach((link) => link.classList.remove("disabled"));
      setShowLoader(false);
    }
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
        <Route
          path="/edit/:id"
          element={<Edit loaderCallback={loaderCallback} />}
        />
        <Route
          path="/create"
          element={<Create loaderCallback={loaderCallback} />}
        />
        <Route
          path="/login"
          element={<LoginScreen loaderCallback={loaderCallback} />}
        />
        <Route
          path="/register"
          element={<RegisterScreen loaderCallback={loaderCallback} />}
        />
        <Route path="/private" element={<PrivateScreen />} />
        <Route
          path="/forgotpassword"
          element={<ForgotPassword loaderCallback={loaderCallback} />}
        />
        <Route element={<PrivateRoute />}></Route>
        <Route path="*" element={<RecipeList to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
