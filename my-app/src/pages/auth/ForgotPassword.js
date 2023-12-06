import React, { useState, useEffect } from "react";
// import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const auth = getAuth();

const ForgotPassword = ({ historyy }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();


  //^Redirect if auth
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.email) history("/")

  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success("Check your email for password reset link");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log("ERROR MSG IN FORGOT PASSWORD", error);
      });
  };

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


      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email"
          autoFocus
        />
        <br />
        <button className="btn btn-raised" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
    </div>
    </div>

  );
};

export default ForgotPassword;
