import React from 'react'
import {useDispatch,} from 'react-redux'
import {logout} from '../reducers/authReducer'

function Todo() {
  const dispatch = useDispatch()
  return (
    <div>
      <h1>Welcome 🧑‍💻👋</h1>
      <button className='btn pink accent-2' onClick={()=>dispatch(logout())}>Logout</button>
    </div>
  )
}

export default Todo