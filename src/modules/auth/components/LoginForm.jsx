import React,{useState} from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login: authLogin, loading, error } = useAuthStore();
  
  const [formaData, setFormData] =useState({
    username: "",
    password: ""
  });

  const login = async () => {
    const result = await authLogin({
      email: formaData.username,
      password: formaData.password
    });
    
    if (result.success) {
      navigate("/dashboard");
    }
  }
  
  // const login = () => {
  //   if (formaData.username == "Talib" && formaData.password == "Talib@123"){
  //     navigate("/dashboard");
  //   }
  // }

  return (
    <div className="login-box">
      <div className="avatar">
        <img src="user-avtar.png" alt="User Avatar" />
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div className="field">
        <label>Email</label>
        <input 
          type="email" 
          placeholder="Enter your E-mail"
          disabled={loading}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
        />
      </div>

      <div className="field">
        <label>Password</label>
        <input 
          type="password" 
          placeholder="Enter your Password"
          disabled={loading}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          } 
        />
      </div>

      <div className="links">
        <a href="/forgot">Forgot Password?</a>
      </div>

      <button className="login-btn" onClick={login} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="register">
         <Link to="/register">Register?</Link>
      </div>

    </div>
  );
};

export default LoginForm;
