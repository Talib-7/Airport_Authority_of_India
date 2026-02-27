import "../../topbar+sidebar/styles/topbar.css"
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../auth/stores/authStore";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      {/* LEFT : AAI LOGO */}
      <div className="topbar-left">
        <img
          src="/aai-logo.png"
          alt="AAI Logo"
          className="topbar-logo"
        />
      </div>

      {/* CENTER : TITLE */}
      <div className="title">
        Airport Authority of India
      </div>

      {/* RIGHT : USER */}
      <div className="user">
        <FaUserCircle className="user-icon" />
        <span>{user?.name || user?.email || "User"}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
