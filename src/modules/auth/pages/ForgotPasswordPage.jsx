import ForgotPasswordForm from "../components/ForgotPasswordForm";
import "../styles/auth_common.css";
import "../styles/forgot.css";

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-page">
      <header className="top-bar">
        <img src="/aai-logo.png" alt="AAI Logo" className="header-logo" />
        <h1 className="header-title">AAI Survey System</h1>
      </header>

      <div className="fixed-bg"></div>

      <div className="forgot-container">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
