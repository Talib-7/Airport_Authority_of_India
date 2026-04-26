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
  const [airportModalSurvey, setAirportModalSurvey] = useState(null);
  const [qrModalData, setQrModalData] = useState(null);
  const [qrLoadingSurveyId, setQrLoadingSurveyId] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

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

  const runningSurveys = surveyList;

  const openSurveyForm = (surveyId) => {
    if (!surveyId) {
      return;
    }

    navigate(`/feedback-form/${surveyId}`);
  };

  const openAirportModal = (survey) => {
    const visibleAirports = survey.airports || [];

    setAirportModalSurvey({
      surveyName: survey.surveyName,
      airports: visibleAirports,
    });
  };

  const openQrModal = async (survey) => {
    if (!survey?.surveyId) {
      return;
    }

    try {
      setQrLoadingSurveyId(survey.surveyId);
      setCopyMessage("");
      const qrData = await surveyManagementService.generateQRCode(survey.surveyId);
      setQrModalData({
        surveyName: survey.surveyName,
        surveyId: survey.surveyId,
        qrCode: qrData.qrCode,
        url: qrData.url,
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate QR code");
    } finally {
      setQrLoadingSurveyId(null);
    }
  };

  const copyQrUrl = async () => {
    if (!qrModalData?.url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(qrModalData.url);
      setCopyMessage("Link copied");
    } catch (_error) {
      setCopyMessage("Copy failed");
    }
  };

  const isAssignedAirportSurvey = (survey) => {
    if (!isAgent || !assignedAirportId) {
      return false;
    }

    return (survey.airports || []).some((airport) => airport.airportId === assignedAirportId);
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
                    {isAssignedAirportSurvey(item) ? (
                      <span className="survey-assigned-badge">Assigned Airport</span>
                    ) : null}
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
                      className="view-btn qr-btn"
                      onClick={() => openQrModal(item)}
                      disabled={qrLoadingSurveyId === item.surveyId}
                    >
                      {qrLoadingSurveyId === item.surveyId ? "Generating..." : "Generate QR"}
                    </button>
                    {!isAgent ? (
                      <button
                        className="view-btn"
                        onClick={() => openAirportModal(item)}
                      >
                        View Airports
                      </button>
                    ) : null}
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

      {airportModalSurvey && (
        <div className="survey-modal" onClick={() => setAirportModalSurvey(null)}>
          <div className="survey-modal-box" onClick={(event) => event.stopPropagation()}>
            <div className="survey-modal-header">
              <h3>Live Airports</h3>
              <button
                className="close-btn"
                onClick={() => setAirportModalSurvey(null)}
              >
                Close
              </button>
            </div>

            <p className="survey-modal-subtitle">{airportModalSurvey.surveyName}</p>

            {airportModalSurvey.airports.length > 0 ? (
              <ul className="survey-airport-list">
                {airportModalSurvey.airports.map((airport) => (
                  <li key={airport.airportId} className="survey-item">
                    {airport.airportName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="survey-empty-airports">No airports available for this survey.</p>
            )}
          </div>
        </div>
      )}

      {qrModalData && (
        <div className="survey-modal" onClick={() => setQrModalData(null)}>
          <div className="survey-modal-box qr-modal-box" onClick={(event) => event.stopPropagation()}>
            <div className="survey-modal-header">
              <h3>Survey QR Code</h3>
              <button className="close-btn" onClick={() => setQrModalData(null)}>
                Close
              </button>
            </div>

            <p className="survey-modal-subtitle">{qrModalData.surveyName}</p>

            <div className="qr-preview-wrap">
              <img src={qrModalData.qrCode} alt="Survey QR" className="qr-preview" />
            </div>

            <div className="qr-url-wrap">
              <input value={qrModalData.url} readOnly className="qr-url-input" />
              <button className="view-btn qr-copy-btn" onClick={copyQrUrl}>Copy Link</button>
            </div>

            {copyMessage ? <p className="qr-copy-message">{copyMessage}</p> : null}
          </div>
        </div>
      )}

    </Layout>
  );
};

export default SurveyRunning;