import "../styles/reset.css";
import { Link } from "react-router-dom";

const ResetPasswordForm = () => {
  return (
    <div className="reset-box">
      <h2 className="form-title">Reset Password</h2>
      <p className="form-subtitle">Create a new strong password</p>

      <div className="field">
        <label>New Password</label>
        <input type="password" placeholder="Enter new password" />
      </div>

      <div className="field">
        <label>Confirm Password</label>
        <input type="password" placeholder="Confirm new password" />
      </div>

      <button className="login-btn">Reset Password</button>

      <div className="register">
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
