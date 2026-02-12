import ResetPasswordForm from "../components/ResetPasswordForm";
import "../styles/auth_common.css";
import "../styles/reset.css";

const ResetPasswordPage = () => {
  return (
    <div className="reset-page">
      <header className="top-bar">
        <img src="/aai-logo.png" alt="AAI Logo" className="header-logo" />
        <h1 className="header-title">AAI Survey System</h1>
      </header>

      <div className="fixed-bg"></div>

      <div className="reset-container">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
