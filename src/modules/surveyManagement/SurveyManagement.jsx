import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import generalQuestionsService from "../generalQuestions/services/generalQuestionsService";
import surveyQuestionsService from "../surveyQuestions/services/surveyQuestionsService";
import surveyManagementService from "./services/surveyManagementService";
import "./surveyManagement.css";

const today = new Date().toISOString().split("T")[0];

const getErrorMessage = (error, fallbackMessage) => {
  const message = error.response?.data?.message || fallbackMessage;
  return Array.isArray(message) ? message.join(", ") : message;
};



const SurveyManagement = () => {
  const [surveys, setSurveys] = useState([]);
  const [generalQuestions, setGeneralQuestions] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("survey");

  const [surveyName, setSurveyName] = useState("");
  const [selectedSurveyIds, setSelectedSurveyIds] = useState([]);
  const [selectedGeneralIds, setSelectedGeneralIds] = useState([]);
  const [editingSurveyId, setEditingSurveyId] = useState(null);

  const [liveSurveyId, setLiveSurveyId] = useState(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [selectedAirportIds, setSelectedAirportIds] = useState([]);

  const [viewPopup, setViewPopup] = useState(null); // { title, items, labelKey }

  const loadSurveyManagementData = async () => {
    setLoading(true);
    setError("");

    try {
      const [surveysData, generalData, surveyData, airportsData] = await Promise.all([
        surveyManagementService.findAll(),
        generalQuestionsService.findAll(),
        surveyQuestionsService.findAll(),
        surveyManagementService.fetchAirports(),
      ]);

      setSurveys(Array.isArray(surveysData) ? surveysData : []);
      setGeneralQuestions(Array.isArray(generalData) ? generalData : []);
      setSurveyQuestions(Array.isArray(surveyData) ? surveyData : []);
      setAirports(Array.isArray(airportsData) ? airportsData : []);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError, "Failed to load survey management data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveyManagementData();
  }, []);

  const resetSurveyForm = () => {
    setEditingSurveyId(null);
    setSurveyName("");
    setSelectedSurveyIds([]);
    setSelectedGeneralIds([]);
    setActiveTab("survey");
  };

  const closeSurveyModal = () => {
    setShowModal(false);
    resetSurveyForm();
  };

  const openCreateModal = () => {
    resetSurveyForm();
    setShowModal(true);
  };

  const openEditModal = (survey) => {
    setEditingSurveyId(survey.surveyId);
    setSurveyName(survey.surveyName);
    setSelectedSurveyIds(survey.surveyQuestions.map((item) => item.surveyQuestionId));
    setSelectedGeneralIds(survey.generalQuestions.map((item) => item.id));
    setActiveTab("survey");
    setShowModal(true);
  };

  const toggleSelection = (value, currentValues, setter) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((item) => item !== value));
      return;
    }

    setter([...currentValues, value]);
  };

  const saveSurvey = async () => {
    if (surveyName.trim() === "") {
      alert("Enter Survey Name");
      return;
    }

    if (selectedSurveyIds.length === 0) {
      alert("Select at least one survey question");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        surveyName: surveyName.trim(),
        surveyQuestionIds: selectedSurveyIds,
        generalQuestionIds: selectedGeneralIds,
      };

      if (editingSurveyId) {
        await surveyManagementService.update(editingSurveyId, payload);
        alert("Survey updated successfully");
      } else {
        await surveyManagementService.create(payload);
        alert("Survey created successfully");
      }

      closeSurveyModal();
      await loadSurveyManagementData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to save survey"));
    } finally {
      setSubmitting(false);
    }
  };

  const openLiveModal = (surveyId) => {
    setLiveSurveyId(surveyId);
    setStartDate(today);
    setEndDate("");
    setSelectedAirportIds([]);
  };

  const closeLiveModal = () => {
    setLiveSurveyId(null);
    setStartDate(today);
    setEndDate("");
    setSelectedAirportIds([]);
  };

  const confirmLive = async () => {
    if (!startDate) {
      alert("Select Start Date");
      return;
    }

    if (startDate < today) {
      alert("Start Date cannot be before today");
      return;
    }

    if (!endDate) {
      alert("Select End Date");
      return;
    }

    if (endDate <= startDate) {
      alert("End Date must be greater than Start Date");
      return;
    }

    if (selectedAirportIds.length === 0) {
      alert("Select at least one Airport");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await surveyManagementService.makeLive(liveSurveyId, {
        startDate,
        endDate,
        airportIds: selectedAirportIds,
      });

      alert("Survey is now live");
      closeLiveModal();
      await loadSurveyManagementData();
    } catch (liveError) {
      setError(getErrorMessage(liveError, "Failed to make survey live"));
    } finally {
      setSubmitting(false);
    }
  };

  const stopSurvey = async (surveyId) => {
    setSubmitting(true);
    setError("");

    try {
      await surveyManagementService.stop(surveyId);
      alert("Survey stopped successfully");
      await loadSurveyManagementData();
    } catch (stopError) {
      setError(getErrorMessage(stopError, "Failed to stop survey"));
    } finally {
      setSubmitting(false);
    }
  };

  const sortedSurveys = [...surveys].sort((left, right) => {
    if (left.status === right.status) {
      return Number(right.surveyId) - Number(left.surveyId);
    }

    const statusOrder = { LIVE: 0, DRAFT: 1, COMPLETED: 2 };
    return statusOrder[left.status] - statusOrder[right.status];
  });


  return (
    <Layout>

      <div className="page-header">

        <h2>Survey Management</h2>

        <button
          className="add-btn"
          onClick={openCreateModal}
        >
          Create Survey
        </button>

      </div>

      {error && <div className="error-text">{error}</div>}
      {loading && <div className="loading-text">Loading survey management data...</div>}


      {/* CREATE SURVEY MODAL */}

      {showModal && (

      <div className="modal-overlay">

      <div className="modal-box">

      <h3 style={{marginBottom:"10px"}}>Create Survey</h3>

      <input
      type="text"
      placeholder="Survey Name"
      value={surveyName}
      onChange={(e)=>setSurveyName(e.target.value)}
      className="survey-input"
      disabled={submitting}
      />

      <div className="tabs">

      <button
      className={activeTab==="survey" ? "active" : ""}
      onClick={()=>setActiveTab("survey")}
      >
      Select Survey Questions
      </button>

      <button
      className={activeTab==="general" ? "active" : ""}
      onClick={()=>setActiveTab("general")}
      >
      Select General Questions
      </button>

      </div>


      <div className="modal-content">

      {activeTab==="survey" && (

      surveyQuestions.length>0 ?

      surveyQuestions.map((q)=>(
      <label key={q.surveyQuestionId} className="checkbox">

      <input
      type="checkbox"
      checked={selectedSurveyIds.includes(q.surveyQuestionId)}
      disabled={submitting}
      onChange={(e)=>{
      toggleSelection(q.surveyQuestionId, selectedSurveyIds, setSelectedSurveyIds);
      }}
      />

      {q.surveyQuestionText}

      </label>
      ))

      :

      <p>No Survey Questions Found</p>

      )}


      {activeTab==="general" && (

      generalQuestions.length>0 ?

      generalQuestions.map((q)=>(
      <label key={q.id} className="checkbox">

      <input
      type="checkbox"
      checked={selectedGeneralIds.includes(q.id)}
      disabled={submitting}
      onChange={(e)=>{
      toggleSelection(q.id, selectedGeneralIds, setSelectedGeneralIds);
      }}
      />

      {q.questionText}

      </label>
      ))

      :

      <p>No General Questions Found</p>

      )}

      </div>


      <div className="modal-footer">

      <button
      className="create-btn"
      onClick={saveSurvey}
      disabled={submitting}
      >
      {editingSurveyId ? "Update" : "Create"}
      </button>

      <button
      className="close-btn"
      onClick={closeSurveyModal}
      disabled={submitting}
      >
      Cancel
      </button>

      </div>

      </div>

      </div>

      )}


      {/* SURVEY TABLE */}

      <div className="table-wrapper">
      <table className="data-table">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Survey ID</th>
            <th>Survey Name</th>
            <th>Survey Questions</th>
            <th>General Questions</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Airports</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {sortedSurveys.length>0?(
            sortedSurveys.map((survey,index)=>(

              <tr key={survey.surveyId}>

                <td>{index+1}</td>
                <td>{survey.surveyId}</td>
                <td>{survey.surveyName}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setViewPopup({ title: "Survey Questions", items: survey.surveyQuestions, labelKey: "surveyQuestionText" })}
                    disabled={survey.surveyQuestions.length === 0}
                  >
                    View ({survey.surveyQuestions.length})
                  </button>
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setViewPopup({ title: "General Questions", items: survey.generalQuestions, labelKey: "questionText" })}
                    disabled={survey.generalQuestions.length === 0}
                  >
                    View ({survey.generalQuestions.length})
                  </button>
                </td>

                <td>{survey.startDate || "-"}</td>
                <td>{survey.endDate || "-"}</td>

                <td>
                  <span
                    className={`status-badge ${
                      survey.status === "LIVE"
                        ? "live-badge"
                        : survey.status === "COMPLETED"
                          ? "completed-badge"
                          : "created-badge"
                    }`}
                  >
                    {survey.status}
                  </span>
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setViewPopup({ title: "Airports", items: survey.airports, labelKey: "airportName" })}
                    disabled={survey.airports.length === 0}
                  >
                    View ({survey.airports.length})
                  </button>
                </td>

                <td>

                  {survey.status === "DRAFT" && (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(survey)}
                        disabled={submitting}
                      >
                        Edit
                      </button>

                      <button
                        className="live-btn"
                        onClick={() => openLiveModal(survey.surveyId)}
                        disabled={submitting}
                      >
                        Make Live
                      </button>
                    </>
                  )}

                  {survey.status === "LIVE" && (
                    <button
                      className="stop-btn"
                      onClick={() => stopSurvey(survey.surveyId)}
                      disabled={submitting}
                    >
                      Stop
                    </button>
                  )}

                  {survey.status === "COMPLETED" && "-"}

                </td>

              </tr>

            ))
          ) : (

          <tr>
          <td colSpan="10" className="no-record">
          No Record Found
          </td>
          </tr>

          )}

        </tbody>

      </table>
  </div>


      {/* VIEW POPUP */}

      {viewPopup !== null && (
        <div className="modal-overlay" onClick={() => setViewPopup(null)}>
          <div className="view-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="view-popup-header">
              <h3>{viewPopup.title}</h3>
              <button className="popup-close-btn" onClick={() => setViewPopup(null)}>✕</button>
            </div>
            <ul className="view-popup-list">
              {viewPopup.items.map((item, index) => (
                <li key={index} className="view-popup-item">
                  <span className="view-popup-num">{index + 1}</span>
                  {item[viewPopup.labelKey]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}


      {/* LIVE MODAL */}

      {liveSurveyId!==null &&(

      <div className="modal-overlay"
  onClick={closeLiveModal}
      >

  <div className="live-modal" onClick={(e) => e.stopPropagation()}>

      <h3 className="live-title">Make Survey Live</h3>

      <div className="live-date-row">

      <div className="date-box">
      <label>Start Date</label>
      <input
      type="date"
      min={today}
      value={startDate}
      onChange={(e)=>setStartDate(e.target.value)}
      disabled={submitting}
      />
      </div>

      <div className="date-box">
      <label>End Date</label>
      <input
      type="date"
      min={startDate || today}
      value={endDate}
      onChange={(e)=>setEndDate(e.target.value)}
      disabled={submitting}
      />
      </div>

      </div>

      <h4 className="airport-title">Select Airports</h4>

      <label className="checkbox select-all">

      <input
      type="checkbox"
      checked={airports.length > 0 && selectedAirportIds.length===airports.length}
      disabled={submitting || airports.length === 0}
      onChange={(e)=>{

      if(e.target.checked){
      setSelectedAirportIds(airports.map((airport) => airport.airportId));
      }else{
      setSelectedAirportIds([]);
      }

      }}
      />

      Select All Airports

      </label>

      <div className="airport-grid">

  {airports.map((airport)=>(
  <label key={airport.airportId} className="checkbox airport-item">

      <input
      type="checkbox"
  checked={selectedAirportIds.includes(airport.airportId)}
  disabled={submitting}
      onChange={(e)=>{
  toggleSelection(airport.airportId, selectedAirportIds, setSelectedAirportIds);
      }}
      />

  {airport.airportName}

      </label>
      ))}

      </div>

      <div className="live-footer">

      <button
      className="create-btn"
      onClick={confirmLive}
      disabled={submitting}
      >
      Confirm Live
      </button>

      <button
      className="close-btn"
      onClick={closeLiveModal}
      disabled={submitting}
      >
      Cancel
      </button>

      </div>

      </div>

      </div>

      )}

    </Layout>
  );
};

export default SurveyManagement;