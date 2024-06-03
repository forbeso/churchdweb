/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabase';

import './style.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function signInWithEmail() {
    const { error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    } else {
      // Redirect to the Search page
      navigate('/cdeck/home');
    }
  }

  return (
    <div className="container-fluid d-flex justify-content-center">
      <div className="row row-width">
        <div className="col-12 loginLeftContainer d-flex flex-column align-items-center">
          <h1 className="title animate__animated animate__fadeInDown">
            Church<span>Deck</span>
          </h1>
          <p className="title mb-5 small animate__animated animate__fadeInUp">
            by Abundant Life Ministries
          </p>

          <div className="input-container mb-3 flex flex-col space-between">
            <label htmlFor="email" className="usernameLabel">
              Username
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              className="input"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="input-container mb-3">
            <label htmlFor="password" className="usernameLabel">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="input"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {loginError && (
            <div className="bg-danger p-2 mb-3">
              <span className="errorMsg text-white">{loginError}</span>
            </div>
          )}

          <button
            type="button"
            className="btn btn-success signInButton mb-3"
            onClick={signInWithEmail}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
