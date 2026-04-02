import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import "./feedbackForm.css";

const FeedbackForm = () => {

  const [survey, setSurvey] = useState(null);

  const [airportInfo, setAirportInfo] = useState({
    name: "",
    code: ""
  });

  const [travelDetails, setTravelDetails] = useState({
    flightNumber: "",
    departureDate: "",
    departureTime: "",
    destination: ""
  });

  const [reason, setReason] = useState("");
  const [aircraftClass, setAircraftClass] = useState("");
  const [returnTrips, setReturnTrips] = useState("");

  const [answers, setAnswers] = useState({});
  const [generalAnswers, setGeneralAnswers] = useState({});

  useEffect(() => {

    const surveys =
      JSON.parse(localStorage.getItem("surveys")) || [];

    const liveSurvey = surveys.find(s => s.isLive);

    if (liveSurvey) setSurvey(liveSurvey);

    // ✅ AUTO FILL AIRPORT
    setAirportInfo({
      name: "Indira Gandhi International Airport",
      code: "DEL"
    });

  }, []);

  const handleRating = (question, rating) => {

    setAnswers({
      ...answers,
      [question.surveyQuestionText]: rating
    });

  };

  const handleGeneralAnswer = (question, value) => {

    setGeneralAnswers({
      ...generalAnswers,
      [question.question]: value
    });

  };

  const submitFeedback = () => {

    const feedbacks =
      JSON.parse(localStorage.getItem("feedbackResponses")) || [];

    const newFeedback = {

      surveyId: survey.id,
      travelDetails,
      reason,
      aircraftClass,
      returnTrips,
      answers,
      generalAnswers,
      submittedAt: new Date().toLocaleString()

    };

    feedbacks.push(newFeedback);

    localStorage.setItem(
      "feedbackResponses",
      JSON.stringify(feedbacks)
    );

    alert("Feedback Submitted Successfully");

  };

  if (!survey) {
    return (
      <Layout>
        <h2 style={{textAlign:"center", marginTop:"50px"}}>
          No Live Survey Available
        </h2>
      </Layout>
    );
  }

  return (

    <Layout>

      <div className="survey-container">

        <h2 className="survey-title">
          AAI CUSTOMER SATISFACTION SURVEY
        </h2>

        {/* ✅ AIRPORT AUTO FILLED (TOP) */}
        <div className="airport-info">

          <div className="airport-field">
            <label>Airport Name</label>
            <input
              value={airportInfo.name}
              readOnly
            />
          </div>

          <div className="airport-field">
            <label>Airport Code</label>
            <input
              value={airportInfo.code}
              readOnly
            />
          </div>

        </div>

        {/* MESSAGE */}

        <p className="dear-text">
          <strong>Dear Passenger,</strong><br/>
          Welcome! We hope you are having a pleasant experience at the airport.  
          Your feedback is extremely valuable to us and helps us improve our facilities and services.  
          We kindly request you to take a few moments to share your experience by completing this survey.  
          You may submit your response online, through an agent, or by scanning the QR code available at the airport.  
          Thank you for your time and support.
        </p>

        {/* TRAVEL DETAILS */}

        <h3 className="section-title">TRAVEL DETAILS</h3>

        <div className="travel-grid">

          <input
            placeholder="Flight Number"
            onChange={(e)=>setTravelDetails({...travelDetails,flightNumber:e.target.value})}
          />

          <input
            type="date"
            onChange={(e)=>setTravelDetails({...travelDetails,departureDate:e.target.value})}
          />

          <input
            type="time"
            onChange={(e)=>setTravelDetails({...travelDetails,departureTime:e.target.value})}
          />

          <input
            placeholder="Destination"
            onChange={(e)=>setTravelDetails({...travelDetails,destination:e.target.value})}
          />

        </div>


        {/* MAIN REASON */}

        <div className="radio-section">
          <p>Main Reason for Trip</p>

          {["Business","Leisure","Other"].map((r,i)=>(
            <label key={i}>
              <input
                type="radio"
                name="reason"
                onChange={()=>setReason(r)}
              />
              {r}
            </label>
          ))}
        </div>


        {/* CLASS */}

        <div className="radio-section">
          <p>Aircraft Class</p>

          {["First Class","Business","Economy"].map((r,i)=>(
            <label key={i}>
              <input
                type="radio"
                name="class"
                onChange={()=>setAircraftClass(r)}
              />
              {r}
            </label>
          ))}
        </div>


        {/* RETURN TRIPS */}

        <div className="radio-section">
          <p>Return Trips in Last 12 Months</p>

          {["1-2","3-5","6-10","11-20","21+"].map((r,i)=>(
            <label key={i}>
              <input
                type="radio"
                name="trips"
                onChange={()=>setReturnTrips(r)}
              />
              {r}
            </label>
          ))}
        </div>


        {/* SURVEY TABLE */}

        <h3 className="section-title">
          Airport Customer Satisfaction Questionnaire
        </h3>

        <table className="survey-table">

          <thead>
            <tr>
              <th>Sl No</th>
              <th>Questions / Parameters</th>
              <th>5</th>
              <th>4</th>
              <th>3</th>
              <th>2</th>
              <th>1</th>
            </tr>
          </thead>

          <tbody>

            {survey.surveyQuestions.map((q,index)=>(

              <tr key={index}>

                <td>{index+1}</td>

                <td className="left">
                  {q.surveyQuestionText}
                </td>

                {[5,4,3,2,1].map(rating=>(
                  <td key={rating}>
                    <input
                      type="radio"
                      name={`q${index}`}
                      onChange={()=>handleRating(q,rating)}
                    />
                  </td>
                ))}

              </tr>

            ))}

          </tbody>

        </table>


        {/* GENERAL QUESTIONS */}

        <h3 className="section-title">Additional Comments</h3>

        {survey.generalQuestions.map((q,index)=>(

          <div key={index} className="general-q">

            <label>{q.question}</label>

            <textarea
              onChange={(e)=>handleGeneralAnswer(q,e.target.value)}
            />

          </div>

        ))}


        {/* SUBMIT */}

        <div className="submit-wrap">
          <button
            className="submit-btn"
            onClick={submitFeedback}
          >
            SUBMIT
          </button>
        </div>

      </div>

    </Layout>
  );
};

export default FeedbackForm;