import React from 'react';

// We import bootstrap to make our application look better.
import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

// We import NavLink to utilize the react router.
import { NavLink } from 'react-router-dom';
import UrlSearch from './urlSearch';

// Here, we display our Navbar
const Navbar = () => {
  return (
    <div>
      <nav className="p-3 container navbar navbar-expand-lg navbar-light">
        <NavLink className="navbar-brand" to="/">
          Wayou Kitchen!
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
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/create">
                Create New Recipe
              </NavLink>
            </li>
            <li>
              <UrlSearch />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
