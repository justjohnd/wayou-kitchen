import { Link, useNavigate, NavLink } from "react-router-dom";

import LocalDiningIcon from "@mui/icons-material/LocalDining";
import CreateIcon from "@mui/icons-material/Create";
import WebIcon from "@mui/icons-material/Web";
import LogoutIcon from "@mui/icons-material/Logout";
// Note that the bootstrap import below is necessary for navbar behavior
import "bootstrap/dist/css/bootstrap.css";
import bootstrap from "bootstrap";

import "../index.css";

import { getWithExpiry } from "../hooks/localStorageWithExpiry";

import UrlSearch from "./urlSearch";

// Here, we display our Navbar
const Navbar = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="disable-while-loading">
      <nav className="p-3 my-3 my-sm-5 container navbar navbar-expand-lg">
        <NavLink className="navbar-brand" to="/">
          veggit
        </NavLink>
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="custom-toggler navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {getWithExpiry("authToken") ? (
            <div className="mt-3">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item mb-4 me-md-4">
                  <WebIcon className="d-lg-none me-3 align-middle" />
                  <UrlSearch
                    className="nav-link"
                    loaderCallback={props.loaderCallback}
                  />
                </li>
                <li className="nav-item mb-4 me-md-4">
                  <NavLink className="nav-link" to="/create">
                    <CreateIcon className="d-lg-none me-3 align-middle" />
                    new
                  </NavLink>
                </li>
                <li className="nav-item mb-4 me-md-4">
                  <NavLink className="nav-link" to="/private">
                    <LocalDiningIcon className="d-lg-none me-3 align-middle" />
                    Cookbook
                  </NavLink>
                </li>
                <li className="nav-item mb-4 me-md-4">
                  <LogoutIcon className="d-lg-none me-3 align-middle" />
                  <Link
                    className="nav-link"
                    to="login"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    {getWithExpiry("authToken") ? "Logout" : "Login"}
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
