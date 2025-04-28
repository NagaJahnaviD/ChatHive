import {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useClerk, useUser} from '@clerk/clerk-react'
import { UserContext } from './UserContext'
import logo from '../assets/logo.png';
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
    <div style={{height:'100px'}} className='pb-0'>
      <nav className='header d-flex justify-content-between mb-0 pb-0'>
        <div className="d-flex justify-content-center header-links w-25 mb-0 align-items-center" style={{ height: '100%' }}>
          <Link to="/" style={{textDecoration:'none', color:'#0077B6'}} className='display-6'><img src={logo} style={{ height: '90px' }} /> ChatHive</Link>

        </div>
        <ul className='d-flex list-unstyled justify-content-around mb-0 p-3 w-25 align-items-center'>
  {!isSignedIn ? (
    <>
      <li><Link to='' style={{textDecoration:'none', color:'#0077B6'}} className='fw-bold'>Home</Link></li>
      <li><Link to='signin' style={{textDecoration:'none', color:'#0077B6'}} className='fw-bold'>Login</Link></li>
      <li><Link to='signup' style={{textDecoration:'none', color:'#0077B6'}} className='fw-bold'>Register</Link></li>
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