import React from 'react';
import { Outlet } from 'react-router-dom';

import { getWithExpiry } from '../../hooks/localStorageWithExpiry';

import LoginScreen from '../screens/LoginScreen';

const PrivateRoute = () => {
  return getWithExpiry('authToken') ? <Outlet /> : <LoginScreen />;
};

export default PrivateRoute;
