import "../styles/forgot.css";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  return (
    <div className="forgot-box">
      <h2 className="form-title">Forgot Password</h2>
      <p className="form-subtitle">
        Enter your registered email to reset your password
      </p>

      <div className="field">
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" />
      </div>

      <button className="login-btn">Send Reset Link</button>

      <div className="register">
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
