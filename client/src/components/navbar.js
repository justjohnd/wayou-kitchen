import { React } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// We import bootstrap to make our application look better.
import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

// We import NavLink to utilize the react router.
import { NavLink } from 'react-router-dom';
import UrlSearch from './urlSearch';

// Here, we display our Navbar
const Navbar = (props) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    props.loginCallback(false);
    navigate('/login');
  };

  return (
    <div className="disable-while-loading">
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
              { props.loginStatus ? (<NavLink className="nav-link" to="/create">
                Create New Recipe
              </NavLink>) : <div></div>}
            </li>
            <li>
              <UrlSearch loaderCallback={props.loaderCallback} />
            </li>
          </ul>
        </div>
        { props.loginStatus ? (<Link to="login" onClick={handleLogout}>Logout</Link>) :
        (<Link to="login">Register / Sign In</Link>) }
      </nav>
    </div>
  );
};

export default Navbar;
