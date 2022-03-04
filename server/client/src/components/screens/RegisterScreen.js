import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterScreen.css";

const RegisterScreen = (props) => {

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]= useState("");

  const navigate = useNavigate();

    useEffect(() => {
      if (localStorage.getItem('authToken')) {
        navigate('/');
      }
    }, []);

  const registerHandler = async (e) => {
    e.preventDefault();
    props.loaderCallback(true);

    const config= {
      header: {
        "Cntent-Type": "application/json"
      }
    }

    if(password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      props.loaderCallback(false);
      setTimeout(() => {
        setError("");
      }, 5000);

      return setError("Passwords do not match.");
    }

    try {
      const {data} = await axios.post("/api/auth/register", {userName, email, password}, config);

      localStorage.setItem("authToken", data.token);
      localStorage.setItem('userId', data.userId);
      props.sessionExpiredCallback(false);

      navigate("/");
      props.loaderCallback(false);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        props.loaderCallback(false);
        setError('');
      }, 5000);
    }
  }
  return (
    <div className="register-screen">
      <form onSubmit={registerHandler} className="register-screen__form">
        <h3 className="register-screen__title">Register</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label className="form-label-sm" htmlFor="name">
            Username:
          </label>
          <input
            className="auth-input"
            type="text"
            required
            id="name"
            placeholder="Enter userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label-sm" htmlFor="email">
            Email:
          </label>
          <input
            className="auth-input"
            type="email"
            required
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label-sm" htmlFor="password">
            Password:
          </label>
          <input
            className="auth-input"
            type="password"
            required
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label-sm" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            className="auth-input"
            type="password"
            required
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
        <span className="register-screen__subtext">
          Already have an account?<Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
}

export default RegisterScreen;
