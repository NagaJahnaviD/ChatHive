import React from 'react';
import { useState } from 'react';

function Register() {

  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');

  function register(){
    
  }

  return (
    <div className='container my-5'>
      <h1 className='text-center'>Register</h1>
      <form className='w-50 mx-auto' onSubmit={register}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" 
              value={username} 
              onChange={ev=>setUsername(ev.target.value)} 
              className="form-control" 
              id="username" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
              type="password" 
              value={password} 
              onChange={ev=>setPassword(ev.target.value)}  
              className="form-control" 
              id="password" />
        </div>

        <button type="submit" className="btn btn-outline-primary">Submit</button>
      </form>
    </div>
  );
}

export default Register;
