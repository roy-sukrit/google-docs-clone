import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';





const Login = () => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test1234");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  let dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          name: user.displayName ? user.displayName : user.email.split('@')[0],
          email: user.email,
        },
      });
      history.push("/user/documents")

    }

    catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {

    signInWithPopup(auth, googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        console.log("user login google--->", user)
        if (user && user.emailVerified == true) {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: user.displayName,
              email: user.email,
            },
          });

          console.log("Login Success", history);

          history("/user/documents");

        }
      })
      .catch(err => toast.error(err))


  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="d-flex flex-row bd-highlight justify-content-start flex-wrap">
      <div className="bd-highlight">

        <img
          src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" // Replace with the actual URL of your image
          alt="Login Image"
          style={{ width: '100%', height: '100%' }}
        />

      </div>

      <div className="bd-highlight p-5 mt-5 mx-auto">
        <p className="form-title">Welcome back ✅</p>

        {loading ? (
          <p className="text-danger">Loading...</p>
        ) : (
          <p>Login to the Dashboard</p>

        )}

        {loginForm()}

        <Button
          onClick={googleLogin}
          type="danger"
          className="mb-3"
          block
          shape="round"
          icon={<GoogleOutlined />}
          size="large"
        >
          Login with Google
        </Button>
        <Link to="/forgot/password" className="float-right text-danger">
          Forgot Password?
        </Link>
      </div>
    </div>

  );
}

export default Login;
