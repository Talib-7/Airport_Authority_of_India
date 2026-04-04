import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import feedbackFormService from "./feedbackFormService";
import "./feedbackForm.css";

const createInitialTravelDetails = () => ({
  flightNumber: "",
  departureDate: "",
  departureTime: "",
  destination: "",
});

const FeedbackForm = () => {
  const { surveyId } = useParams();

  const [survey, setSurvey] = useState(null);
  const [airportInfo, setAirportInfo] = useState({
    name: "",
    code: "",
  });
  const [travelDetails, setTravelDetails] = useState(createInitialTravelDetails());
  const [reason, setReason] = useState("");
  const [aircraftClass, setAircraftClass] = useState("");
  const [returnTrips, setReturnTrips] = useState("");
  const [answers, setAnswers] = useState({});
  const [generalAnswers, setGeneralAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadSurvey = async (latitude, longitude) => {
      try {
        const response = await feedbackFormService.findRunningSurvey(
          Number(surveyId),
          latitude,
          longitude,
        );

        if (cancelled) {
          return;
        }

        setSurvey(response.survey);
        setAirportInfo({
          name: response.airport.airportName,
          code: response.airport.airportCode,
        });
        setUserLocation({ latitude, longitude });
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError.response?.data?.message ||
            "Unable to load the running survey for your current location.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!surveyId) {
      setError("Missing survey id in the survey link.");
      setLoading(false);
      return undefined;
    }

    if (!navigator.geolocation) {
      setError("Location services are not available in this browser.");
      setLoading(false);
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadSurvey(position.coords.latitude, position.coords.longitude);
      },
      () => {
        if (!cancelled) {
          setError("Location access is required to open the survey.");
          setLoading(false);
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );

    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  const handleRating = (question, rating) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.surveyQuestionId]: rating,
    }));
  };

  const handleGeneralAnswer = (question, value) => {
    setGeneralAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: value,
    }));
  };

  const submitFeedback = async () => {
    if (!survey || !userLocation) {
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await feedbackFormService.submitFeedback(survey.id, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        travelDetails,
        reason,
        aircraftClass,
        returnTrips,
        answers,
        generalAnswers,
      });

      setSuccessMessage("Feedback submitted successfully.");
      setTravelDetails(createInitialTravelDetails());
      setReason("");
      setAircraftClass("");
      setReturnTrips("");
      setAnswers({});
      setGeneralAnswers({});
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading running survey...
        </h2>
      </Layout>
    );
  }

  if (error && !survey) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center", marginTop: "50px", color: "#b42318" }}>
          {error}
        </h2>
      </Layout>
    );
  }

  if (!survey) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          No Live Survey Available
        </h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="survey-container">
        <h2 className="survey-title">AAI CUSTOMER SATISFACTION SURVEY</h2>

        {error ? (
          <div style={{ marginBottom: "12px", color: "#b42318", fontWeight: 600 }}>
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div style={{ marginBottom: "12px", color: "#067647", fontWeight: 600 }}>
            {successMessage}
          </div>
        ) : null}

        <div className="airport-info">
          <div className="airport-field">
            <label>Airport Name</label>
            <input value={airportInfo.name} readOnly />
          </div>

          <div className="airport-field">
            <label>Airport Code</label>
            <input value={airportInfo.code} readOnly />
          </div>
        </div>

        <p className="dear-text">
          <strong>Dear Passenger,</strong>
          <br />
          Welcome! We hope you are having a pleasant experience at the airport.
          Your feedback is extremely valuable to us and helps us improve our facilities and services.
          We kindly request you to take a few moments to share your experience by completing this survey.
          You may submit your response online, through an agent, or by scanning the QR code available at the airport.
          Thank you for your time and support.
        </p>

        <h3 className="section-title">TRAVEL DETAILS</h3>

        <div className="travel-grid">
          <input
            placeholder="Flight Number"
            value={travelDetails.flightNumber}
            onChange={(event) => setTravelDetails({ ...travelDetails, flightNumber: event.target.value })}
          />

          <input
            type="date"
            value={travelDetails.departureDate}
            onChange={(event) => setTravelDetails({ ...travelDetails, departureDate: event.target.value })}
          />

          <input
            type="time"
            value={travelDetails.departureTime}
            onChange={(event) => setTravelDetails({ ...travelDetails, departureTime: event.target.value })}
          />

          <input
            placeholder="Destination"
            value={travelDetails.destination}
            onChange={(event) => setTravelDetails({ ...travelDetails, destination: event.target.value })}
          />
        </div>

        <div className="radio-section">
          <p>Main Reason for Trip</p>

          {["Business", "Leisure", "Other"].map((value, index) => (
            <label key={index}>
              <input
                type="radio"
                name="reason"
                checked={reason === value}
                onChange={() => setReason(value)}
              />
              {value}
            </label>
          ))}
        </div>

        <div className="radio-section">
          <p>Aircraft Class</p>

          {["First Class", "Business", "Economy"].map((value, index) => (
            <label key={index}>
              <input
                type="radio"
                name="class"
                checked={aircraftClass === value}
                onChange={() => setAircraftClass(value)}
              />
              {value}
            </label>
          ))}
        </div>

        <div className="radio-section">
          <p>Return Trips in Last 12 Months</p>

          {["1-2", "3-5", "6-10", "11-20", "21+"].map((value, index) => (
            <label key={index}>
              <input
                type="radio"
                name="trips"
                checked={returnTrips === value}
                onChange={() => setReturnTrips(value)}
              />
              {value}
            </label>
          ))}
        </div>

        <h3 className="section-title">Airport Customer Satisfaction Questionnaire</h3>

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
            {(survey.surveyQuestions || []).map((question, index) => (
              <tr key={question.surveyQuestionId || index}>
                <td>{index + 1}</td>

                <td className="left">{question.surveyQuestionText}</td>

                {[5, 4, 3, 2, 1].map((rating) => (
                  <td key={rating}>
                    <input
                      type="radio"
                      name={`q${question.surveyQuestionId || index}`}
                      checked={answers[question.surveyQuestionId] === rating}
                      onChange={() => handleRating(question, rating)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="section-title">Additional Comments</h3>

        {(survey.generalQuestions || []).map((question, index) => (
          <div key={question.id || index} className="general-q">
            <label>{question.question || question.questionText}</label>

            <textarea
              value={generalAnswers[question.id] || ""}
              onChange={(event) => handleGeneralAnswer(question, event.target.value)}
            />
          </div>
        ))}

        <div className="submit-wrap">
          <button
            className="submit-btn"
            type="button"
            disabled={submitting}
            onClick={submitFeedback}
          >
            {submitting ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackForm;