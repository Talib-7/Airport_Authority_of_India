import { useState } from "react";
import Layout from "../layout/Layout";
import "./surveyRunning.css";

const AGENT_ROLE_ID = 2;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (_error) {
    return null;
  }
};

const SurveyRunning = () => {
  const currentUser = getCurrentUser();
  const isAgent = currentUser?.roleId === AGENT_ROLE_ID;
  const assignedAirportId = currentUser?.airportId;

  const [surveyList] = useState([
    {
      surveyId: "SRV-101",
      surveyName: "Passenger Feedback 2024",
      startDate: "01-01-2024",
      endDate: "31-12-2024",
      isRunning: true,
      airports: [
        { airportId: 1, airportName: "Delhi" },
        { airportId: 2, airportName: "Mumbai" },
        { airportId: 3, airportName: "Bengaluru" },
      ],
    },
    {
      surveyId: "SRV-102",
      surveyName: "Service Quality Survey",
      startDate: "01-02-2024",
      endDate: "30-06-2024",
      isRunning: true,
      airports: [
        { airportId: 4, airportName: "Chennai" },
        { airportId: 5, airportName: "Hyderabad" },
      ],
    },
    {
      surveyId: "SRV-103",
      surveyName: "Airport Cleanliness Survey",
      startDate: "15-03-2024",
      endDate: "15-09-2024",
      isRunning: true,
      airports: [
        { airportId: 6, airportName: "Kolkata" },
        { airportId: 7, airportName: "Ahmedabad" },
      ],
    },
    {
      surveyId: "SRV-104",
      surveyName: "Security Check Experience",
      startDate: "01-04-2024",
      endDate: "31-10-2024",
      isRunning: false,
      airports: [],
    }
  ]);

  const runningSurveys = surveyList
    .filter((survey) => survey.isRunning)
    .filter((survey) => {
      if (!isAgent) {
        return true;
      }

      if (!assignedAirportId) {
        return false;
      }

      return survey.airports.some((airport) => airport.airportId === assignedAirportId);
    });

  // 🔥 Modal State
  const [activeAirports, setActiveAirports] = useState(null);

  return (
    <Layout>

      <div className="page-header">
        <h2>Running Surveys</h2>
      </div>

      <table className="survey-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Survey Id</th>
            <th>Survey Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Live Airports</th>
          </tr>
        </thead>

        <tbody>
          {runningSurveys.length > 0 ? (
            runningSurveys.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.surveyId}</td>
                <td>{item.surveyName}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>
                  <span className="badge green">Live</span>
                </td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => {
                      const visibleAirports = isAgent
                        ? item.airports.filter((airport) => airport.airportId === assignedAirportId)
                        : item.airports;
                      setActiveAirports(visibleAirports);
                    }}
                  >
                    View Airports
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No Running Surveys Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔥 Airport Modal */}
      {activeAirports && (
        <div className="survey-modal">
          <div className="survey-modal-box">
            <h3>Live Airports</h3>

            {activeAirports.map((airport, i) => (
              <div key={i} className="survey-item">
                • {airport.airportName}
              </div>
            ))}

            <button
              className="close-btn"
              onClick={() => setActiveAirports(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default SurveyRunning;