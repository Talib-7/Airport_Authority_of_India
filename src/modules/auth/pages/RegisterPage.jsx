import RegisterForm from "../components/RegisterForm";
import "../auth.css";

const RegisterPage = () => {
  return (
    <div className="login-page">
      <header className="top-bar">
         <img
                src="aai-logo.png"
                alt="AAI Logo"
                className="header-logo"
            />
        <h1 className="header-title">AAI Survey System</h1>
      </header>

      <div className="login-container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
