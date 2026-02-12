import RegisterForm from "../components/RegisterForm";
import "../styles/register.css";
import "../styles/auth_common.css"

const RegisterPage = () => {
  return (
    <div className="register-page">
      <header className="top-bar">
         <img
                src="/aai-logo.png"
                alt="AAI Logo"
                className="header-logo"
            />
        <h1 className="header-title">Airport Authority of India</h1>
      </header>

      <div className="fixed-bg"></div>

      <div className="register-container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
