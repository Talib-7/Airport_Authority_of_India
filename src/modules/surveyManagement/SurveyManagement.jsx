import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import "./surveyManagement.css";

const airports = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata"
];

const today = new Date().toISOString().split("T")[0];

const SurveyManagement = () => {

  const [surveys, setSurveys] = useState([]);
  const [generalQuestions, setGeneralQuestions] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("survey");

  const [surveyName, setSurveyName] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState([]);
  const [selectedGeneral, setSelectedGeneral] = useState([]);

  const [liveSurveyId,setLiveSurveyId]=useState(null);
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [selectedAirports,setSelectedAirports]=useState([]);

  useEffect(() => {

    const storedSurveys =
      JSON.parse(localStorage.getItem("surveys")) || [];

    const storedGeneral =
      JSON.parse(localStorage.getItem("generalQuestions")) || [];

    const storedSurvey =
      JSON.parse(localStorage.getItem("surveyQuestions")) || [];

    setSurveys(storedSurveys);
    setGeneralQuestions(storedGeneral);
    setSurveyQuestions(storedSurvey);

  }, []);

  const saveSurveys = (data) => {
    setSurveys(data);
    localStorage.setItem("surveys", JSON.stringify(data));
  };

  // CREATE SURVEY

  const createSurvey = () => {

    if (surveyName.trim() === "") {
      alert("Enter Survey Name");
      return;
    }

    const newSurvey = {

      id: Date.now(),
      surveyName,
      surveyQuestions: selectedSurvey,
      generalQuestions: selectedGeneral,
      startDate:null,
      endDate:null,
      airports:[],
      isLive:false,
      hasBeenLive:false

    };

    const updated = [...surveys, newSurvey];

    saveSurveys(updated);

    alert("Survey Created Successfully");

    setShowModal(false);
    setSurveyName("");
    setSelectedSurvey([]);
    setSelectedGeneral([]);

  };


  // MAKE LIVE

  const makeLive=(id)=>{
    setLiveSurveyId(id);
  };

  const confirmLive=()=>{

    if(!startDate){
    alert("Select Start Date");
    return;
  }

  if(startDate < today){
    alert("Start Date cannot be before today");
    return;
  }

  if(!endDate){
    alert("Select End Date");
    return;
  }

  if(endDate <= startDate){
    alert("End Date must be greater than Start Date");
    return;
  }

  if(selectedAirports.length===0){
    alert("Select at least one Airport");
    return;
  }

    const updated=[...surveys];

    const index=updated.findIndex(s=>s.id===liveSurveyId);

    if(index!==-1){

      updated[index].startDate=startDate;
      updated[index].endDate=endDate;
      updated[index].airports=selectedAirports;
      updated[index].isLive=true;
      updated[index].hasBeenLive=true;

    }

    saveSurveys(updated);

    setLiveSurveyId(null);
    setStartDate("");
    setEndDate("");
    setSelectedAirports([]);

  };

  // STOP

    const stopSurvey=(id)=>{

    const updated=[...surveys];

    const index=updated.findIndex(s=>s.id===id);

    if(index!==-1){

    const stoppedSurvey = updated[index];

    updated[index].isLive=false;

    // get history
    const history =
    JSON.parse(localStorage.getItem("surveyHistory")) || [];

    // copy survey
    history.push({
    ...stoppedSurvey,
    status:"Completed",
    stoppedAt:new Date().toLocaleString()
    });

    // save history
    localStorage.setItem(
    "surveyHistory",
    JSON.stringify(history)
    );

    }

    saveSurveys(updated);

    };


  // SORT LIVE FIRST

  const sortedSurveys=[...surveys].sort(
    (a,b)=>b.isLive-a.isLive
  );


  return (
    <Layout>

      <div className="page-header">

        <h2>Survey Management</h2>

        <button
          className="add-btn"
          onClick={()=>setShowModal(true)}
        >
          Create Survey
        </button>

      </div>


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

      surveyQuestions.map((q,i)=>(
      <label key={i} className="checkbox">

      <input
      type="checkbox"
      onChange={(e)=>{

      if(e.target.checked){
      setSelectedSurvey([...selectedSurvey,q]);
      }else{
      setSelectedSurvey(
      selectedSurvey.filter(
      item=>item.surveyQuestionText!==q.surveyQuestionText
      )
      );
      }

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

      generalQuestions.map((q,i)=>(
      <label key={i} className="checkbox">

      <input
      type="checkbox"
      onChange={(e)=>{

      if(e.target.checked){
      setSelectedGeneral([...selectedGeneral,q]);
      }else{
      setSelectedGeneral(
      selectedGeneral.filter(
      item=>item.question!==q.question
      )
      );
      }

      }}
      />

      {q.question}

      </label>
      ))

      :

      <p>No General Questions Found</p>

      )}

      </div>


      <div className="modal-footer">

      <button
      className="create-btn"
      onClick={createSurvey}
      >
      Create
      </button>

      <button
      className="close-btn"
      onClick={()=>setShowModal(false)}
      >
      Cancel
      </button>

      </div>

      </div>

      </div>

      )}


      {/* SURVEY TABLE */}

      <table className="data-table">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Survey ID</th>
            <th>Survey Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>View Airport</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {sortedSurveys.length>0?(
            sortedSurveys.map((survey,index)=>(

              <tr key={survey.id}>

                <td>{index+1}</td>
                <td>{survey.id}</td>
                <td>{survey.surveyName}</td>

                <td>{survey.isLive ? survey.startDate : "-"}</td>
                <td>{survey.isLive ? survey.endDate : "-"}</td>

                <td>
                {survey.isLive && (
                <span className="live-badge">LIVE</span>
                )}
                </td>

                <td>

                {survey.isLive && survey.airports?.length>0
                ?(
                <button
                className="view-btn"
                onClick={()=>alert(survey.airports.join(", "))}
                >
                View
                </button>
                )
                : "-"}

                </td>

                <td>

                {!survey.hasBeenLive && !survey.isLive && (
                <button
                className="edit-btn"
                onClick={()=>{
                setShowModal(true);
                setSurveyName(survey.surveyName);
                setSelectedSurvey(survey.surveyQuestions);
                setSelectedGeneral(survey.generalQuestions);
                }}
                >
                Edit
                </button>
                )}

                {!survey.isLive && (
                <button
                className="live-btn"
                onClick={()=>makeLive(survey.id)}
                >
                Make Live
                </button>
                )}

                {survey.isLive && (
                <button
                className="stop-btn"
                onClick={()=>stopSurvey(survey.id)}
                >
                Stop
                </button>
                )}

                </td>

              </tr>

            ))
          ) : (

          <tr>
          <td colSpan="8" className="no-record">
          No Record Found
          </td>
          </tr>

          )}

        </tbody>

      </table>


      {/* LIVE MODAL */}

      {liveSurveyId!==null &&(

      <div className="modal-overlay"
      onClick={()=>setShowModal(false)}
      >

      <div className="live-modal">

      <h3 className="live-title">Make Survey Live</h3>

      <div className="live-date-row">

      <div className="date-box">
      <label>Start Date</label>
      <input
      type="date"
      min={today}
      value={startDate}
      onChange={(e)=>setStartDate(e.target.value)}
      />
      </div>

      <div className="date-box">
      <label>End Date</label>
      <input
      type="date"
      min={startDate || today}
      value={endDate}
      onChange={(e)=>setEndDate(e.target.value)}
      />
      </div>

      </div>

      <h4 className="airport-title">Select Airports</h4>

      <label className="checkbox select-all">

      <input
      type="checkbox"
      checked={selectedAirports.length===airports.length}
      onChange={(e)=>{

      if(e.target.checked){
      setSelectedAirports(airports);
      }else{
      setSelectedAirports([]);
      }

      }}
      />

      Select All Airports

      </label>

      <div className="airport-grid">

      {airports.map((a,i)=>(
      <label key={i} className="checkbox airport-item">

      <input
      type="checkbox"
      checked={selectedAirports.includes(a)}
      onChange={(e)=>{

      if(e.target.checked){
      setSelectedAirports([...selectedAirports,a]);
      }else{
      setSelectedAirports(
      selectedAirports.filter(item=>item!==a)
      );
      }

      }}
      />

      {a}

      </label>
      ))}

      </div>

      <div className="live-footer">

      <button
      className="create-btn"
      onClick={confirmLive}
      >
      Confirm Live
      </button>

      </div>

      </div>

      </div>

      )}

    </Layout>
  );
};

export default SurveyManagement;