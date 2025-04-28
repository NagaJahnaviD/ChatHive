import React from 'react'
import { UserContext } from './UserContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat';
import './home.css'
import Contacts from './Contacts';
import ss from '../assets/ss.png'
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

    const vantaRef = useRef(null); // This will point to the DOM element

  useEffect(() => {
    let effect = null;
  
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
  
    const initVanta = async () => {
      if (!vantaRef.current) return; // prevent early execution
  
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js");
  
        effect = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xf3fbff,
          color1: 0x11ed90,
          color2: 0x3348e8,
          colorMode: "lerpGradient",
          birdSize: 1.2,
          wingSpan: 19,
          speedLimit: 8,
          separation: 38,
          alignment: 72,
          cohesion: 14,
        });
      } catch (err) {
        console.error("Failed to load Vanta or Three.js", err);
      }
    };
  
    if (!isSignedIn) {
      // Delay to allow DOM to render
      const timeout = setTimeout(() => {
        initVanta();
      }, 100); // 100ms delay
  
      return () => {
        clearTimeout(timeout);
        if (effect) effect.destroy();
      };
    }
  }, [isSignedIn]);

  console.log(currentUser)
  
  return (
    <div className='pt-0'>
      {
        isSignedIn===false && 
        <div
  className="lead center"
  ref={vantaRef}
  style={{
    width: "100%",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "#333",
    fontWeight: "bold"
  }}
>
   <section className="hero">
        <div className="hero-content">
          <h1>Connect instantly with QuickChat</h1>
          <p>Simple, secure messaging for everyone</p>
        </div>
        <div className="hero-image">
          <div className="phone-mockup">
            <img 
              src={ss} 
              alt="QuickChat in action" 
              className="mockup-screen" 
            />
          </div>
        </div>
      </section> 

</div>

      }
      {
        isSignedIn === true &&
        <div className="d-flex justify-content-evenly w-100">
          <Contacts/>
          {/* <Chat/> */}
        </div>
      }   
      
    </div>
  )
}

export default Home