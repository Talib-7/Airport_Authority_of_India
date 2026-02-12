import "../styles/reset.css";
import { Link } from "react-router-dom";

const OtpVerifyForm = () => {
  return (
    <div className="reset-box">
      <h2 className="form-title">Verify OTP</h2>
      <p className="form-subtitle">
        Enter the OTP sent to your registered email
      </p>

      <div className="field">
        <label>OTP</label>
        <input type="text" placeholder="Enter 6-digit OTP" />
      </div>

      <button className="login-btn">Verify OTP</button>

      <div className="register">
        <Link to="/forgot-password">Resend OTP</Link>
      </div>
    </div>
  );
};

export default OtpVerifyForm;
