import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Profile  from './components/Profile';

function App() {

  const browserROuterObj = createBrowserRouter([{
    path:"/",
    element:<RootLayout />,
    children:[{
      path:"",
      element:<Home />,
    },
    {
      path:"signup",
      element:<Register />
    },
    {
      path:"signin",
      element:<Login />
    },
    {
      path:"user-profile/:email",
      element:<Profile />
    }
    ]
  }])

  return (
    <div>
      <RouterProvider router={browserROuterObj} />
    </div>
  )
}

export default App