import React, { useState,useEffect } from "react";
// import { auth } from "../../firebase";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { toast} from "react-toastify";
import { useSelector } from "react-redux";

const auth = getAuth();


 
const Register = ({history}) => {
  const [email, setEmail] = useState("");
 
   const {user}=useSelector((state)=>({...state}));

    useEffect(() => {
      if(user) history.push("/")
     
    }, [user]);

    //^Register user
  const handleSubmit = async (e) => {
    e.preventDefault();

    //^After registration redirect in email
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    
    //^fiirebase to send email (user email,config)
    await auth.sendSignInLinkToEmail(email, config);
    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );
    //^save user email in local storage
    window.localStorage.setItem("emailForRegistration", email);

    //^clear state
    setEmail("");
  };
 
  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
 
      <button type="submit" className="btn btn-raised">
        Register
      </button>
    </form>
  );
 
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};
 
export default Register;