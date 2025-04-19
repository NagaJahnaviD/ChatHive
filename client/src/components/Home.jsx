import React from 'react'
import { UserContext } from './UserContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat';
import Contacts from './Contacts';
function Home() {

  const [error, setError] = useState('')
  const [isUserInitialized, setUserInitialized] = useState(false)
  const {isSignedIn, isLoaded, user} = useUser();
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const navigate=useNavigate()
  const {getToken}=useAuth()
  
  useEffect(()=>{
    if(isSignedIn===true){
      setCurrentUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        passwordHash: user.passwordEnabled,
        profilePictureUrl: user.imageUrl,
        createdAt: user.createdAt,
        contacts: [],
        blockedUsers: [],
        username: user.emailAddresses[0].emailAddress.split('@')[0]
      })
    }
    setUserInitialized(true)
  }, [isLoaded, isSignedIn, user])

  // sync user with database
    useEffect(() => {
      const syncWithDB = async ()=>{
        const token=await getToken()
        if (isSignedIn && currentUser?.email) {
          try{
            let res = await axios.post('http://localhost:1234/user-api/user', currentUser)
            let {message, payload} = res.data;
            if(message === 'User created successfully'){
              setCurrentUser({...currentUser, ...payload});
            }else{
              setError(message);
            }
          } catch(err){
            setError('Failed to sync with DB')
            console.log(err)
          }
        }
      }
      syncWithDB();
      console.log(error)
      
    }, [currentUser, isUserInitialized])

  console.log(currentUser)
  
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
        <div className="d-flex justify-content-evenly w-100">
          {/* <h3>Hey there, {user.firstName}, we'll change the ui dw</h3>
          <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" /> */}
          <Contacts/>
          {/* <Chat/> */}
        </div>
      }   
      
    </div>
  )
}

export default Home