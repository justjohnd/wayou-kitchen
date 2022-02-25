import { React, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';

// We import bootstrap to make our application look better.
import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';
import UrlSearch from './urlSearch';

// Here, we display our Navbar
const Navbar = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="disable-while-loading">
      <nav className="p-3 mb-3 mb-sm-5 container navbar navbar-expand-lg">
          <NavLink className="navbar-brand" to="/">
            veggit
          </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {(!props.sessionExpired && localStorage.getItem('authToken')) ? (
            <div>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/private">
                    My Cookbook
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/create">
                    new
                  </NavLink>
                </li>
                <li className="nav-item">
                  <UrlSearch
                    className="nav-link"
                    loaderCallback={props.loaderCallback}
                  />
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="login" onClick={() => {
                    handleLogout();
                    props.sessionExpiredCallback(true);
                  }}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link className="login-link" to="login">
              Register / Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
