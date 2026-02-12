import LoginForm from "../components/LoginForm";
import "../styles/auth_common.css";
import "../styles/login.css";


const LoginPage = () => {
  return (
    <div className="login-page">
        <header className="top-bar">
            <img
                src="aai-logo.png"
                alt="AAI Logo"
                className="header-logo"
            />

            <h1 className="header-title">Airport Authority of India </h1>
        </header>

        <div className="fixed-bg"></div>

      <div className="login-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
