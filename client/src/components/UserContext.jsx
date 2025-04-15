import {createContext, useEffect, useState} from 'react'
import axios from 'axios';
export const UserContext=createContext({});

function UserContextProvider({children}) {
    const [currentUser, setCurrentUser]=useState({
      username:'',
      firstName:'',
      lastName: '',
      email:'',
      passwordHash:'',
      profilePictureUrl:'',
      createdAt:'',
      contacts:[],
      blockedUsers:[]
    });
   
  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider