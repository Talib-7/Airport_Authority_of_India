import { useState } from "react";
import Layout from "../layout/Layout";
import "./surveyRunning.css";

const SurveyRunning = () => {

  const [surveyList] = useState([
    {
      surveyId: "SRV-101",
      surveyName: "Passenger Feedback 2024",
      startDate: "01-01-2024",
      endDate: "31-12-2024",
      isRunning: true,
      airports: ["Delhi", "Mumbai", "Bengaluru"]
    },
    {
      surveyId: "SRV-102",
      surveyName: "Service Quality Survey",
      startDate: "01-02-2024",
      endDate: "30-06-2024",
      isRunning: true,
      airports: ["Chennai", "Hyderabad"]
    },
    {
      surveyId: "SRV-103",
      surveyName: "Airport Cleanliness Survey",
      startDate: "15-03-2024",
      endDate: "15-09-2024",
      isRunning: true,
      airports: ["Kolkata", "Ahmedabad"]
    },
    {
      surveyId: "SRV-104",
      surveyName: "Security Check Experience",
      startDate: "01-04-2024",
      endDate: "31-10-2024",
      isRunning: false,
      airports: []
    }
  ]);

  const runningSurveys = surveyList.filter(survey => survey.isRunning);

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
                    onClick={() => setActiveAirports(item.airports)}
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
                • {airport}
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