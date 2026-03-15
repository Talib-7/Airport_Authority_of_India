import { useEffect, useState } from "react";
import Layout from "../layout/Layout";


const SurveyHistory = () => {

const [history,setHistory]=useState([]);

useEffect(()=>{

const storedHistory =
JSON.parse(localStorage.getItem("surveyHistory")) || [];

setHistory(storedHistory);

},[]);

return(

<Layout>

<div className="page-header">
<h2>Survey History</h2>
</div>

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
</tr>

</thead>

<tbody>

{history.length>0 ? (

history.map((survey,index)=>(
<tr key={survey.id}>

<td>{index+1}</td>

<td>{survey.id}</td>

<td>{survey.surveyName}</td>

<td>{survey.startDate}</td>

<td>{survey.endDate}</td>

<td>
    {survey.airports?.length > 0 ? (
    <button
    className="view-btn"
    onClick={()=>alert(survey.airports.join(", "))}
    >
    View
    </button>
    ) : "-"}
</td>

<td>
<span className="created-badge">
Completed
</span>
</td>

</tr>
))

) : (

<tr>
<td colSpan="7" className="no-record">
No Survey History Found
</td>
</tr>

)}

</tbody>

</table>

</Layout>

);

};

export default SurveyHistory;