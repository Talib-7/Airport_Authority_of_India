import Layout from "../../layout/Layout";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <Layout>

      <h1>Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <span>Filters :</span>

        <select>
          <option>Select Airport</option>
        </select>

        <select>
          <option>Select Agent</option>
        </select>

        <select>
          <option>Select Region</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <StatCard title="Total Feedback" value="1287" color="blue" />
        <StatCard title="Today's Feedback" value="324" color="green" />
        <StatCard title="Today's Average" value="—" color="yellow" />
        <StatCard title="Today's Bad" value="0" color="red" />
      </div>

    </Layout>
  );
};

export default Dashboard;
