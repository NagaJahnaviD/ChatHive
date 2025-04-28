import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import image from '../assets/login.svg';

function Login() {
  return (
    <div className="d-flex  vh-100 justify-content-between">
    <img src={image} alt="" />
    <div className="d-flex flex-column w-50 align-items-center justify-content-center">
      <SignIn />
    </div>
    </div>
  );
}

export default Login;
