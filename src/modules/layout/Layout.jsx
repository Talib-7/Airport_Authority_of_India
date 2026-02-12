import Sidebar from "../topbar+sidebar/components/Sidebar";
import Topbar from "../topbar+sidebar/components/Topbar";

const Layout = ({ children }) => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />

      <div className="dashboard-right">
        <Topbar />

        <div className="dashboard-main">
          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
