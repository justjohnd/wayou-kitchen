import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import './LoginScreen.css';

import {
  setWithExpiry,
  getWithExpiry,
} from '../../hooks/localStorageWithExpiry';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (getWithExpiry('authToken')) {
      navigate('/');
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    props.loaderCallback(true);

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );

      setWithExpiry('authToken', data.token);

      navigate('/private');
      props.loaderCallback(false);
    } catch (error) {
      setError(error.response.data.error);
      props.loaderCallback(false);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={loginHandler} className="login-screen__form">
        <h3 className="login-screen__title">Login</h3>
        {error && <span className="error-message">{error}</span>}
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
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label className="form-label-sm" htmlFor="password">
            Password:
            <Link
              to="/forgotpassword"
              className="login-screen__forgotpassword"
              tabIndex={4}
            >
              Forgot Password?
            </Link>
          </label>
          <input
            className="auth-input"
            autoComplete="on"
            type="password"
            required
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={1}
          />
        </div>

        <button type="submit" className="btn btn-primary" tabIndex={3}>
          Login
        </button>
        <span className="login-screen__subtext">
          Don't have an account?<Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
