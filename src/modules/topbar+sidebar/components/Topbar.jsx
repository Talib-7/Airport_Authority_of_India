import "../../topbar+sidebar/styles/topbar.css"
import { FaUserCircle } from "react-icons/fa";

const Topbar = () => {
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
        <span>Username</span>
      </div>
    </header>
  );
};

export default Topbar;
