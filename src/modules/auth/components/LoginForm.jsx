import "../auth.css";
//for Registration Page
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="login-box">
      <div className="avatar">
        <img src="user-avtar.png" alt="User Avatar" />
      </div>

      <div className="field">
        <label>Username</label>
        <input type="email" placeholder="Enter your E-mail" />
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Enter your Password" />
      </div>

      <div className="links">
        <a href="#">Forgot Password?</a>
      </div>

      <button className="login-btn">Login</button>

      <div className="register">
         <Link to="/register">Register?</Link>
      </div>

    </div>
  );
};

export default LoginForm;
