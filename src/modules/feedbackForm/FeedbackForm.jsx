import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import feedbackFormService from "./feedbackFormService";
import surveyManagementService from "../surveyManagement/services/surveyManagementService";
import "./feedbackForm.css";

const createInitialTravelDetails = () => ({
  flightNumber: "",
  departureDate: "",
  departureTime: "",
  destination: "",
});

const getQuestionKey = (question, fallbackIndex) =>
  String(question?.id ?? question?.questionId ?? fallbackIndex);

const getQuestionText = (question) => question?.question || question?.questionText || "Question";

const getQuestionOptions = (question) =>
  Array.isArray(question?.options) ? question.options : [];

const getOptionValue = (option, fallbackIndex) =>
  String(option?.optionValue ?? option?.optionLabel ?? option?.value ?? option?.label ?? fallbackIndex);

const getOptionLabel = (option) => option?.optionLabel || option?.optionValue || option?.label || option?.value || "Option";

const FeedbackForm = () => {
  const ratingLabels = {
    5: 'Excellent',
    4: 'Very Good',
    3: 'Good',
    2: 'Fair',
    1: 'Poor',
  };
  const { surveyId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const canGenerateQr = currentUser?.roleId === 1 || currentUser?.roleId === 2;

  const [survey, setSurvey] = useState(null);
  const [airportInfo, setAirportInfo] = useState({
    name: "",
    code: "",
  });
  const [travelDetails, setTravelDetails] = useState(createInitialTravelDetails());
  const [answers, setAnswers] = useState({});
  const [generalAnswers, setGeneralAnswers] = useState({});
  const [additionalComment, setAdditionalComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [qrModalData, setQrModalData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

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
    const questionKey = getQuestionKey(question, "unknown");

    setGeneralAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionKey]: value,
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
        answers,
        generalAnswers,
        additionalComment,
      });

      setSuccessMessage("Feedback submitted successfully.");
      setTravelDetails(createInitialTravelDetails());
      setAnswers({});
      setGeneralAnswers({});
      setAdditionalComment("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateQr = async () => {
    if (!surveyId || !canGenerateQr) {
      return;
    }

    try {
      setQrLoading(true);
      setCopyMessage("");
      const qrData = await surveyManagementService.generateQRCode(Number(surveyId));
      setQrModalData(qrData);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate QR code.");
    } finally {
      setQrLoading(false);
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

  if (loading) {
    return (
      <div className="survey-container">
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading running survey...
        </h2>
      </div>
    );
  }

  if (error && !survey) {
    return (
      <div className="survey-container">
        <h2 style={{ textAlign: "center", marginTop: "50px", color: "#b42318" }}>
          {error}
        </h2>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="survey-container">
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          No Live Survey Available
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="survey-container">
        <div className="survey-title-row">
          <h2 className="survey-title">AAI CUSTOMER SATISFACTION SURVEY</h2>
          {canGenerateQr ? (
            <button className="submit-btn qr-generate-btn" onClick={handleGenerateQr} disabled={qrLoading}>
              {qrLoading ? "Generating..." : "Generate QR"}
            </button>
          ) : null}
        </div>

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

        {(survey.generalQuestions || []).map((question, index) => {
          const questionKey = getQuestionKey(question, index);
          const questionType = String(question?.questionType || "TEXT").toUpperCase();
          const questionValue = generalAnswers[questionKey] || "";
          const options = getQuestionOptions(question);

          if (questionType === "RADIO") {
            return (
              <div key={questionKey} className="radio-section">
                <p>{getQuestionText(question)}</p>

                {options.map((option, optionIndex) => {
                  const optionValue = getOptionValue(option, optionIndex);

                  return (
                    <label key={`${questionKey}-${optionValue}`}>
                      <input
                        type="radio"
                        name={`gq-${questionKey}`}
                        checked={String(questionValue) === optionValue}
                        onChange={() => handleGeneralAnswer(question, optionValue)}
                      />
                      {getOptionLabel(option)}
                    </label>
                  );
                })}
              </div>
            );
          }

          if (questionType === "SELECT") {
            return (
              <div key={questionKey} className="general-q">
                <label>{getQuestionText(question)}</label>
                <select
                  value={questionValue}
                  onChange={(event) => handleGeneralAnswer(question, event.target.value)}
                >
                  <option value="">Select an option</option>
                  {options.map((option, optionIndex) => {
                    const optionValue = getOptionValue(option, optionIndex);

                    return (
                      <option key={`${questionKey}-${optionValue}`} value={optionValue}>
                        {getOptionLabel(option)}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          }

          if (questionType === "RATING") {
            return (
              <div key={questionKey} className="radio-section">
                <p>{getQuestionText(question)}</p>

                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={`${questionKey}-${rating}`}>
                    <input
                      type="radio"
                      name={`gq-${questionKey}`}
                      checked={String(questionValue) === String(rating)}
                      onChange={() => handleGeneralAnswer(question, String(rating))}
                    />
                    {rating} - {ratingLabels[rating]}
                  </label>
                ))}
              </div>
            );
          }

          return (
            <div key={questionKey} className="general-q">
              <label>{getQuestionText(question)}</label>

              <input
                type="text"
                value={questionValue}
                onChange={(event) => handleGeneralAnswer(question, event.target.value)}
                placeholder="Type your answer"
              />
            </div>
          );
        })}

        <h3 className="section-title">Airport Customer Satisfaction Questionnaire</h3>

        <table className="survey-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Questions / Parameters</th>
              <th>5<br/><small>Excellent</small></th>
              <th>4<br/><small>Very Good</small></th>
              <th>3<br/><small>Good</small></th>
              <th>2<br/><small>Fair</small></th>
              <th>1<br/><small>Poor</small></th>
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

        <div className="general-q">
          <label>Additional Comments</label>
          <textarea
            value={additionalComment}
            onChange={(event) => setAdditionalComment(event.target.value)}
            placeholder="Share any additional comments"
          />
        </div>

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

      {qrModalData ? (
        <div className="survey-modal" onClick={() => setQrModalData(null)}>
          <div className="survey-modal-box" onClick={(event) => event.stopPropagation()}>
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
              <button className="submit-btn qr-copy-btn" onClick={copyQrUrl}>Copy Link</button>
            </div>

            {copyMessage ? <p className="qr-copy-message">{copyMessage}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FeedbackForm;