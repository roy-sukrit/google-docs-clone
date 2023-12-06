import React, { useState, useEffect } from "react";
// import { auth } from "../../firebase";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const auth = getAuth();



const Register = ({ historyy }) => {
  const [email, setEmail] = useState("");

  const { user } = useSelector((state) => ({ ...state }));
  const history = useNavigate();

  useEffect(() => {
    if (user) history("/")

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

      <button type="submit" className="btn btn-raised" >
        Register
      </button>
    </form>
  );

  return (
    <div className="d-flex flex-row bd-highlight justify-content-start flex-wrap">
      <div className="row">
        <div className="bd-highlight">

          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" // Replace with the actual URL of your image
            alt="Login Image"
            style={{ width: '100%', height: '100%' }}
          />

        </div>
        <div className="bd-highlight p-5 mt-5 mx-auto">
          <h4 className="form-title">Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;