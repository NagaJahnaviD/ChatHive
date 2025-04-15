import React from 'react'
import { UserContext } from './UserContext';
import { useUser } from '@clerk/clerk-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {

  const [error, setError] = useState('')
  const {isSignedIn, isLoaded, user} = useUser();
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const navigate=useNavigate()
  
  useEffect(()=>{
    if(isSignedIn===true){
      setCurrentUser({
        ...currentUser, 
        username: '',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        passwordHash: user.passwordEnabled,
        profilePictureUrl: user.imageUrl,
        createdAt: user.createdAt,
        contacts: [],
        blockedUsers: []
      })
    }
  }, [isLoaded])
  
  return (
    <div>
      {
        isSignedIn===false && 
        <div className="lead center">
          Login avvu bro
        </div>
      }
      {
        isSignedIn === true &&
        <div className="d-flex justify-content-around w-100">
          <h3>Hey there, {user.firstName}, we'll change the ui dw</h3>
          <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
        </div>
      }   
    </div>
  )
}

export default Home