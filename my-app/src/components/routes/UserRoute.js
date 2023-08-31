import React from 'react'
import {Route} from 'react-router-dom'
import {useSelector} from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'
const UserRoute = ({children,...rest}) => {
  const {user} =useSelector((state)=>({...state}))

  //^empty obj can also give value sp && , animation(loading)
  return user && user.email ? 
  <Route {...rest} />
  : 
  <React.Fragment>
  <h1 className="text-danger">
  <LoadingToRedirect/>
  </h1>
  </React.Fragment>
 }
export default UserRoute;