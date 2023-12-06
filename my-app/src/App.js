import TextEditor from "./TextEditor";
import { v4 as uuidV4 } from "uuid"
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation

}
  from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, lazy, Suspense } from "react";

import { useDispatch, useSelector } from 'react-redux'
import { Spin, Space } from 'antd';
import { auth } from "./firebase";
import UserPage from "./pages/UserPage";
import PrivateRoute from "./protectedRoute";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Header = lazy(() => import("./components/nav/Header"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const UserRoute = lazy(() => import('./components/routes/UserRoute'))
const Password = lazy(() => import('./pages/user/Password'))
const History = lazy(() => import('./pages/user/History'))


// import HomePage from "./Home";
function App() {
  let dispatch = useDispatch();
  // const location = useLocation();
  // const passedState = location.state;
  const { user } = useSelector((state) => ({ ...state }));


  useEffect(() => {
    //getting the active user status
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            name: user.displayName,
            email: user.email,
          },
        });

      }
    })
    //stop after getting once
    return () => unsubscribe();

  }, [])


  return (
    <Router>

    <Suspense fallback={
      <div className="col text-center d-flex justify-content-center p-5 ">
        <br />
        <div className="col p-200">
          <Space size="middle">
            <Spin size="large" />
          </Space>
        </div>
      </div>}>
      <Header />

      <div className="col  d-flex justify-content-around ">

      </div>

      <ToastContainer />

    
        <Routes>
          {/* <Route path="/document" element={<a href={`/documents/${uuidV4()}`}>create document</a>} /> */}
          <Route path="/document" exact element={<Navigate to={`/documents/${uuidV4()}`} />} />
          <Route path='/documents/:id'  element={<TextEditor />} />
          <Route path='/' element={ <Home />}/>
          <Route path='/user/documents' element={ user ? <UserPage/>  : <Navigate to="/login"  />}/>
          {/* <Route path='/user/documents' element={<UserPage/> }/> */}


          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/register/complete" element={<RegisterComplete/>} />
          <Route exact path="/forgot/password" element={<ForgotPassword/>} />'

          {/* <Route exact path="/user/history" element={<History/>} /> */}

          <Route exact path="/user/password" element={<Password/>} />

        </Routes>

    </Suspense>
    </Router>


  );
}

export default App;
