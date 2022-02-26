import React from "react";
import { Routes, Route } from "react-router-dom";

//Routing
import PrivateRoute from "./routing/PrivateRoute";

//Screens
import PrivateScreen from "./screens/PrivateScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../index.css";


// Here, we display our Navbar
const Auth = (props) => {
  return (
    <Routes className="disable-while-loading">
      <PrivateRoute path="/" element={<PrivateScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
      <Route path="/resetpassword/:resetToken" element={<ResetPasswordScreen />} />
    </Routes>
  );
};

export default Auth;
