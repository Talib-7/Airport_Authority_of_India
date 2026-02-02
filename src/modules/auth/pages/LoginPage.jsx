import LoginForm from "../components/LoginForm";
import "../auth.css";

const LoginPage = () => {
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
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
