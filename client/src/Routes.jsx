import {useContext} from 'react'
import {UserContext} from './UserContext';
import Register from './Register';

function Routes() {
    const {username, id} = useContext(UserContext);
    console.log(username)
    if(username){
        return "hey there! logged in"
    }
  return (
    <div>
        <Register />
    </div>
  )
}

export default Routes