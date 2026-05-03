import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import StatCard from "../components/StatCard";
import dashboardService from "../services/dashboardService";
import "../styles/dashboard.css";

const AGENT_ROLE_ID = 2;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (_error) {
    return null;
  }
};

const Dashboard = () => {
  const currentUser = getCurrentUser();
  const isAgent = currentUser?.roleId === AGENT_ROLE_ID;
  const assignedAirportId = currentUser?.airportId;

  const [stats, setStats] = useState({
    totalFeedback: 0,
    todaysFeedback: 0,
    todaysNegative: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (isAgent) {
          // For agents, pass their userId to get accumulated data from all assigned airports
          params.agentId = currentUser.userId;
        }

        const data = await dashboardService.getDashboardStats(
          params.airportId || null,
          params.surveyId || null,
          params.agentId || null,
        );

        setStats(data);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError("Failed to load dashboard stats");
        setStats({
          totalFeedback: 0,
          todaysFeedback: 0,
          todaysNegative: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [isAgent, currentUser?.userId]);

  return (
    <Layout>

      <h1>Dashboard</h1>

      {/* Filters for Admins */}
      {!isAgent && (
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
      )}

      {/* Error Message */}
      {error && (
        <div style={{ marginBottom: "20px", color: "#b42318", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ marginBottom: "20px", color: "#666" }}>
          Loading dashboard...
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <div className="stats-row">
          <StatCard title="Total Feedback" value={stats.totalFeedback} color="blue" />
          <StatCard title="Today's Feedback" value={stats.todaysFeedback} color="green" />
          <StatCard title="Today's Negative" value={stats.todaysNegative} color="red" />
        </div>
      )}

    </Layout>
  );
};

export default Dashboard;
