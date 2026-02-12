import React,{useState} from "react";

//for Registration Page
import { Link, Navigate, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formaData, setFormData] =useState({
    username: "",
    password: ""
  });


  function login() {
    const username = "talib@gmail.com"
    const password = "talib123"
    if ((username === formaData.username) && (password === formaData.password)) {
      navigate("/dashboard")
    }
  }
  
  return (
    <div className="login-box">
      <div className="avatar">
        <img src="user-avtar.png" alt="User Avatar" />
      </div>

      <div className="field">
        <label>Username</label>
        <input type="email" placeholder="Enter your E-mail" onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        username: e.target.value,
      }))
    }/>
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Enter your Password" onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        password: e.target.value,
      }))
    } />
      </div>

      <div className="links">
        <a href="/forgot">Forgot Password?</a>
      </div>

      <button className="login-btn" onSubmit={login()}>Login</button>

      <div className="register">
         <Link to="/register">Register?</Link>
      </div>

    </div>
  );
};

export default LoginForm;
