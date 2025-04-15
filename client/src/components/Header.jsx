import {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useClerk, useUser} from '@clerk/clerk-react'
import { UserContext } from './UserContext'

function Header() {

  const {signOut} = useClerk()
  const {currentUser, setCurrentUser}=useContext(UserContext)
  const navigate=useNavigate();
  const {isSignedIn, user, isLoaded} = useUser()

  // function to signout
  async function handleSignout(){
    await signOut();
    setCurrentUser(null)
    navigate('/')
  }


  return (
    <div style={{height:'100px'}}>
      <nav className='header d-flex justify-content-between'>
        <div className="d-flex justify-content-center header-links w-25 mb-0 align-items-center">
          <Link to="/" style={{textDecoration:'none'}}>LOGO</Link>
        </div>
        <ul className='d-flex list-unstyled justify-content-around mb-0 p-3 w-25 align-items-center'>
  {!isSignedIn ? (
    <>
      <li><Link to='' style={{textDecoration:'none'}}>Home</Link></li>
      <li><Link to='signin' style={{textDecoration:'none'}}>Login</Link></li>
      <li><Link to='signup' style={{textDecoration:'none'}}>Register</Link></li>
    </>
  ) : (
    <>
      <li className='p-2'>
        <img src={user.imageUrl} width='40px' className='rounded-circle' alt="User" />
      </li>
      <li>
        <button className="btn btn-outline-primary" onClick={handleSignout}>Sign Out</button>
      </li>
    </>
  )}
</ul>

      </nav>
    </div>
  )
}

export default Header