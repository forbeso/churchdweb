import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';
import Label from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import ChurchIcon from '../assets/churchicon';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

export default function NewLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionData, setSessionData] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-center">
          <ChurchIcon className="h-6 w-6 text-dark dark:text-gray-50" />

          <span className="ml-2 text-2xl font-bold">ChurchDeck</span>
        </div>
        <form className="space-y-4">
          <div className="gap">
            <Label htmlFor="email" className="mr-3">
              Email
            </Label>
            <Input
              type="email"
              placeholder="Username"
              className="mb-3"
              // autoFocus
              required
              value={email}
              onChange={(query) => handleEmailChange(query)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mr-3">
              Password
            </Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input mb-3"
              required
              value={password}
              onChange={(query) => handlePasswordChange(query)}
            />

            <span onClick={toggleShowPassword} className="cursor-pointer">
              {showPassword ? (
                <VisibilityRoundedIcon style={{ color: '#f1c40f' }} />
              ) : (
                <VisibilityOffRoundedIcon />
              )}
            </span>
          </div>
          {loginError && (
            <div className="bg-danger p-2 mb-3  text-center rounded">
              <span className="errorMsg text-white">{loginError}</span>
            </div>
          )}
          <button
            className="bg-dark text-white w-full"
            type="button"
            onClick={() => signInWithEmail()}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
