import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdFeedback,
  MdQuestionAnswer,
  MdLocationOn,
  MdAddBox,
  MdStorage,
  MdAssessment,
  MdPeople,
  MdCheckCircle,
  MdPersonAdd,
} from "react-icons/md";
import { FaPoll } from "react-icons/fa";

import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="menu-title">Admin</span>
      </div>


      <ul className="menu">

        <NavLink to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdDashboard className="menu-icon" />
              Dashboard
            </li>
          )}
        </NavLink>

        <NavLink to="/survey-running" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <FaPoll className="menu-icon" />
              Survey Running
            </li>
          )}
        </NavLink>

        <NavLink to="/feedback-received" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdFeedback className="menu-icon" />
              Feedback Received
            </li>
          )}
        </NavLink>

        <NavLink to="/general-questions" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdQuestionAnswer className="menu-icon" />
              General Questions
            </li>
          )}
        </NavLink>

        <NavLink to="/survey-questions" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdQuestionAnswer className="menu-icon" />
              Survey Questions
            </li>
          )}
        </NavLink>

        <NavLink to="/airports" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdLocationOn className="menu-icon" />
              Airports
            </li>
          )}
        </NavLink>

        <NavLink to="/create-feedback" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdAddBox className="menu-icon" />
              Create Feedback
            </li>
          )}
        </NavLink>

        <NavLink to="/metabase" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdStorage className="menu-icon" />
              Metabase
            </li>
          )}
        </NavLink>

        <NavLink to="/reports" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdAssessment className="menu-icon" />
              Reports
            </li>
          )}
        </NavLink>

        <NavLink to="/create-user" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdPersonAdd className="menu-icon" />
              Create User
            </li>
          )}
        </NavLink>

        <NavLink to="/registered-users" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdPeople className="menu-icon" />
              Registered Users
            </li>
          )}
        </NavLink>

        <NavLink to="/approved-users" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              <MdCheckCircle className="menu-icon" />
              Approved Users
            </li>
          )}
        </NavLink>

      </ul>
    </aside>
  );
};

export default Sidebar;
