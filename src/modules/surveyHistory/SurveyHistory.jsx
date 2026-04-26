import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import surveyManagementService from "../surveyManagement/services/surveyManagementService";
import "./SurveyHistory.css";


const SurveyHistory = () => {

const [history,setHistory]=useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [selectedSurvey, setSelectedSurvey] = useState(null);
const navigate = useNavigate();

const handleUseAsTemplate = (survey) => {
if (!survey) {
return;
}

const surveyQuestionIds = (survey.surveyQuestions || [])
.map((item) => Number(item.surveyQuestionId))
.filter((id) => Number.isInteger(id) && id > 0);

const generalQuestionIds = (survey.generalQuestions || [])
.map((item) => Number(item.id))
.filter((id) => Number.isInteger(id) && id > 0);

navigate("/survey-management", {
state: {
templateSurvey: {
sourceSurveyId: survey.surveyId,
surveyName: survey.surveyName,
surveyQuestionIds,
generalQuestionIds,
},
},
});
};

useEffect(()=>{

const loadCompletedSurveys = async () => {
setLoading(true);
setError("");

try {
const surveys = await surveyManagementService.findCompleted();
setHistory(Array.isArray(surveys) ? surveys : []);
} catch (loadError) {
const message = loadError.response?.data?.message || "Failed to load survey history";
setError(Array.isArray(message) ? message.join(", ") : message);
} finally {
setLoading(false);
}
};

loadCompletedSurveys();

},[]);

return(

<Layout>

<div className="page-header">
<h2>Survey History</h2>
</div>

{error && <div className="error-text">{error}</div>}
{loading && <div className="loading-text">Loading survey history...</div>}

<table className="data-table">

<thead>

<tr>
<th>Sr No</th>
<th>Survey ID</th>
<th>Survey Name</th>
<th>Start Date</th>
<th>End Date</th>
<th>Airports</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{history.length>0 ? (

history.map((survey,index)=>(
<tr key={survey.surveyId}>

<td>{index+1}</td>

<td>{survey.surveyId}</td>

<td>{survey.surveyName}</td>

<td>{survey.startDate}</td>

<td>{survey.endDate}</td>

<td>
{survey.airports?.length || 0}
</td>

<td>
<span className="created-badge">
Completed
</span>
</td>

<td>
<button
className="view-btn"
onClick={() => setSelectedSurvey(survey)}
>
View Details
</button>
</td>

</tr>
))

) : (

<tr>
<td colSpan="8" className="no-record">
No Survey History Found
</td>
</tr>

)}

</tbody>

</table>

{selectedSurvey !== null && (
<div className="history-modal-overlay" onClick={() => setSelectedSurvey(null)}>
<div className="history-modal" onClick={(event) => event.stopPropagation()}>
<div className="history-modal-header">
<h3>{selectedSurvey.surveyName}</h3>
<div className="history-modal-actions">
<button
className="history-template-btn"
onClick={() => handleUseAsTemplate(selectedSurvey)}
>
Use as Template
</button>
<button className="history-close-btn" onClick={() => setSelectedSurvey(null)}>Close</button>
</div>
</div>

<div className="history-details-grid">
<div><strong>Survey ID:</strong> {selectedSurvey.surveyId}</div>
<div><strong>Status:</strong> COMPLETED</div>
<div><strong>Start Date:</strong> {selectedSurvey.startDate || "-"}</div>
<div><strong>End Date:</strong> {selectedSurvey.endDate || "-"}</div>
</div>

<div className="history-section">
<h4>Airports</h4>
{selectedSurvey.airports?.length > 0 ? (
<ul>
{selectedSurvey.airports.map((airport) => (
<li key={airport.airportId}>{airport.airportName}</li>
))}
</ul>
) : (
<p>No airports assigned</p>
)}
</div>

<div className="history-section">
<h4>Survey Questions</h4>
{selectedSurvey.surveyQuestions?.length > 0 ? (
<ul>
{selectedSurvey.surveyQuestions.map((question) => (
<li key={question.surveyQuestionId}>{question.surveyQuestionText}</li>
))}
</ul>
) : (
<p>No survey questions available</p>
)}
</div>

<div className="history-section">
<h4>General Questions</h4>
{selectedSurvey.generalQuestions?.length > 0 ? (
<ul>
{selectedSurvey.generalQuestions.map((question) => (
<li key={question.id}>{question.questionText}</li>
))}
</ul>
) : (
<p>No general questions available</p>
)}
</div>
</div>
</div>
)}

</Layout>

);

};

export default SurveyHistory;