import React, { useState, useEffect } from "react";
// import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch} from "react-redux";

import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let dispatch = useDispatch();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
   
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();


    if(!email||!password){
        toast.error("Email & Password Required!")
        return;
    }

    if(password.length<6){
        toast.error(" Password Must have at least 6 characters!")
        return;
    }

    
   try{
    const result=await auth.signInWithEmailLink(
        email,
        window.location.href
    )
  
    if(result.user.emailVerified){
        //remove email from local
        window.localStorage.removeItem("emailForRegistration")

        let user =auth.currentUser  
        console.log("user register complete--->",user)
     
        await user.updatePassword(password)
      .then(
        ()=>{
           dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name:user.displayName ? user.displayName : user.email.split('@')[0],
              email:user.email,
            },
          });
        
        })      
      .catch(err=>console.log(err))    

        //redirect
        history.push("/user/history")

    }

}
    
    catch(error){
        console.log(error);
        toast.error(error.message);

    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type="email" className="form-control" value={email} disabled />

      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
      />
      <br />
      <button type="submit" className="btn btn-raised">
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
