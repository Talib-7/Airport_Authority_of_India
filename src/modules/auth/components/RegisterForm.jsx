// import "../styles/register.css";
// import "../styles/auth_common.css"
//returning from registration page to login page
import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <div className="register-box">
      <h2 className="form-title">Agent Registration</h2>
      <p className="form-subtitle">
        please fill in the form to create your account
      </p>

      <div className="field">
        <label>Full Name:</label>
        <input type="text" placeholder="Enter your full name" />
      </div>

      <div className="field">
        <label>E-mail:</label>
        <input type="email" placeholder="Enter your e-mail address" />
      </div>

      <div className="field">
        <label>Mobile No.:</label>
        <input type="text" placeholder="Enter your mobile no." />
      </div>

      <div className="field">
        <label>Company Name:</label>
        <input type="text" placeholder="Enter your company name" />
      </div>

      <div className="field">
        <label>Upload Id:</label>
        <input type="file" />
      </div>

      <div className="field">
        <label>Airport Name:</label>
        <select>
          <option>Select Airport</option>
          <option>Delhi (DEL)</option>
          <option>Mumbai (BOM)</option>
          <option>Bengaluru (BLR)</option>
        </select>
      </div>

      <button className="login-btn">Register</button>

      <div className="register">
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
