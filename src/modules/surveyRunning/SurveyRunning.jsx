import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import surveyManagementService from "../surveyManagement/services/surveyManagementService";
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
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAgent = currentUser?.roleId === AGENT_ROLE_ID;
  const assignedAirportId = currentUser?.airportId;

  const [surveyList, setSurveyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeAirports, setActiveAirports] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadRunningSurveys = async () => {
      try {
        const response = await surveyManagementService.findRunning();

        if (!cancelled) {
          setSurveyList(Array.isArray(response) ? response : []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Unable to load running surveys");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRunningSurveys();

    return () => {
      cancelled = true;
    };
  }, []);

  const runningSurveys = surveyList.filter((survey) => {
    if (!isAgent) {
      return true;
    }

    if (!assignedAirportId) {
      return false;
    }

    return (survey.airports || []).some((airport) => airport.airportId === assignedAirportId);
  });

  const openSurveyForm = (surveyId) => {
    if (!surveyId) {
      return;
    }

    navigate(`/feedback-form/${surveyId}`);
  };

  return (
    <Layout>
      <div className="page-header">
        <h2>Running Surveys</h2>
      </div>

      {error ? <div className="airport-alert airport-alert-error">{error}</div> : null}

      {loading ? (
        <div style={{ padding: "20px" }}>Loading running surveys...</div>
      ) : (
        <table className="survey-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Survey Id</th>
              <th>Survey Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {runningSurveys.length > 0 ? (
              runningSurveys.map((item, index) => (
                <tr key={item.surveyId || index}>
                  <td>{index + 1}</td>
                  <td>{item.surveyId}</td>
                  <td>
                    <button
                      type="button"
                      className="view-btn"
                      onClick={() => openSurveyForm(item.surveyId)}
                    >
                      {item.surveyName}
                    </button>
                  </td>
                  <td>{item.startDate || "-"}</td>
                  <td>{item.endDate || "-"}</td>
                  <td>
                    <span className="badge green">Live</span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openSurveyForm(item.surveyId)}
                    >
                      Open Form
                    </button>
                    <button
                      className="view-btn"
                      onClick={() => {
                        const visibleAirports = isAgent
                          ? (item.airports || []).filter((airport) => airport.airportId === assignedAirportId)
                          : (item.airports || []);
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
      )}

      {activeAirports && (
        <div className="survey-modal">
          <div className="survey-modal-box">
            <h3>Live Airports</h3>

            {activeAirports.map((airport, index) => (
              <div key={index} className="survey-item">
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