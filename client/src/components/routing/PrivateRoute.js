import React from "react";
import { Outlet } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";

const PrivateRoute = () => {
  return (
        localStorage.getItem("authToken") ? <Outlet /> : <LoginScreen />
  );
};

export default PrivateRoute;
