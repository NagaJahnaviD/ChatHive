import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import image from '../assets/register.svg';

function Register() {
  return (
    <div className="d-flex vh-100">
      <div className="d-flex flex-column justify-content-center align-items-center w-50 p-5">
        <SignUp />
      </div>
      <img src={image} alt="" />
     
      
    </div>
  );
}

export default Register;
