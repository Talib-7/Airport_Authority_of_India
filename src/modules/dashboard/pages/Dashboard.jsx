import Layout from "../../layout/Layout";
import StatCard from "../components/StatCard";
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

  const surveyAggregates = [
    { surveyId: "SRV-101", airportId: 1, totalFeedback: 345, todaysFeedback: 56, todaysBad: 4 },
    { surveyId: "SRV-102", airportId: 2, totalFeedback: 290, todaysFeedback: 48, todaysBad: 3 },
    { surveyId: "SRV-103", airportId: 1, totalFeedback: 270, todaysFeedback: 42, todaysBad: 1 },
    { surveyId: "SRV-104", airportId: 5, totalFeedback: 382, todaysFeedback: 67, todaysBad: 5 },
  ];

  const visibleAggregates = surveyAggregates.filter((survey) => {
    if (!isAgent) {
      return true;
    }

    if (!assignedAirportId) {
      return false;
    }

    return survey.airportId === assignedAirportId;
  });

  const totalFeedback = visibleAggregates.reduce((sum, survey) => sum + survey.totalFeedback, 0);
  const todaysFeedback = visibleAggregates.reduce((sum, survey) => sum + survey.todaysFeedback, 0);
  const todaysBad = visibleAggregates.reduce((sum, survey) => sum + survey.todaysBad, 0);
  const todaysAverage = todaysFeedback > 0 ? ((todaysFeedback - todaysBad) / todaysFeedback) * 100 : 0;

  const hasVisibleData = visibleAggregates.length > 0 && totalFeedback > 0;
  const displayStats = hasVisibleData
    ? {
        totalFeedback,
        todaysFeedback,
        todaysBad,
        todaysAverage,
      }
    : {
        totalFeedback: 186,
        todaysFeedback: 27,
        todaysBad: 2,
        todaysAverage: 92.6,
      };

  return (
    <Layout>

      <h1>Dashboard</h1>

      {/* Filters */}
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

      {/* Stats Cards */}
      <div className="stats-row">
        <StatCard title="Total Feedback" value={displayStats.totalFeedback} color="blue" />
        <StatCard title="Today's Feedback" value={displayStats.todaysFeedback} color="green" />
        <StatCard title="Today's Average" value={`${displayStats.todaysAverage.toFixed(1)}%`} color="yellow" />
        <StatCard title="Today's Bad" value={displayStats.todaysBad} color="red" />
      </div>

    </Layout>
  );
};

export default Dashboard;
