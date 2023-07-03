/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';

import './style.scss';

function Login() {
  const [email, setEmail] = useState('testuser@test.com');
  const [password, setPassword] = useState('password123');
  const [sessionData, setSessionData] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
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
        <div className="col-12 loginLeftContainer d-flex justify-content-center align-items-center">
          <h1 className="title animate__animated animate__fadeInDown">
            Church<span>Deck</span>
          </h1>
          <p className="title mb-5 small animate__animated animate__fadeInUp">
            by Abundant Life Ministries
          </p>

          {/* <label className="usernameLabel">Username</label> */}
          <input
            type="text"
            placeholder="Username"
            className="input mb-3"
            // autoFocus
            required
            value={email}
            onChange={(query) => handleEmailChange(query)}
          />

          {/* <label className="usernameLabel">Password</label> */}
          <input
            type="password"
            placeholder="Password"
            className="input mb-3"
            required
            value={password}
            onChange={(query) => handlePasswordChange(query)}
          />

          <div className="bg-danger p-2 mb-3">
            <span className="errorMsg text-white">{loginError}</span>
          </div>

          <button
            type="button"
            className="btn btn-success signInButton mb-3"
            onClick={() => signInWithEmail()}
          >
            Sign in
          </button>

          {/* <div>
                <input type="checkbox" className="form-check-input" id="remembermeCheck"></input>
                <label className="form-check-label remembermeLabel" htmlFor="remembermeCheck"> &nbsp; Remember me</label>
            </div> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
