import OtpVerifyForm from "../components/OtpVerifyForm";
import "../styles/auth_common.css";
import "../styles/reset.css";

const OtpVerifyPage = () => {
  return (
    <div className="reset-page">
      <header className="top-bar">
        <img src="/aai-logo.png" alt="AAI Logo" className="header-logo" />
        <h1 className="header-title">AAI Survey System</h1>
      </header>

      <div className="fixed-bg"></div>

      <div className="reset-container">
        <OtpVerifyForm />
      </div>
    </div>
  );
};

export default OtpVerifyPage;
