import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import feedbackReceivedService from './feedbackReceivedService';
import surveyManagementService from '../surveyManagement/services/surveyManagementService';
import './feedbackReceived.css';

export default function FeedbackReceived() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);

  // Filter states
  const [airportId, setAirportId] = useState('');
  const [surveyId, setSurveyId] = useState('');
  const [agentId, setAgentId] = useState('');

  // Filter options
  const [airports, setAirports] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [agents, setAgents] = useState([]);
  const [surveyDefinitions, setSurveyDefinitions] = useState([]);

  const [totalFeedback, setTotalFeedback] = useState(0);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
    fetchSurveyDefinitions();
    fetchAllFeedback();
  }, []);

  const fetchSurveyDefinitions = async () => {
    try {
      const data = await surveyManagementService.findAll();
      setSurveyDefinitions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading survey definitions:', err);
      setSurveyDefinitions([]);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const data = await feedbackReceivedService.getFilterOptions();
      setAirports(data.airports || []);
      setSurveys(data.surveys || []);
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const fetchAllFeedback = async (airportIdParam = '', surveyIdParam = '', agentIdParam = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackReceivedService.getAllFeedback(
        airportIdParam || airportId || undefined,
        surveyIdParam || surveyId || undefined,
        agentIdParam || agentId || undefined
      );
      setFeedbackList(data.feedbacks || []);
      setTotalFeedback(data.totalFeedback || 0);
    } catch (err) {
      setError('Failed to load feedback. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newAirportId = '', newSurveyId = '', newAgentId = '') => {
    await fetchAllFeedback(
      newAirportId !== '' ? newAirportId : airportId,
      newSurveyId !== '' ? newSurveyId : surveyId,
      newAgentId !== '' ? newAgentId : agentId
    );
  };

  const handleAirportChange = (e) => {
    const value = e.target.value;
    setAirportId(value);
    handleFilterChange(value, surveyId, agentId);
  };

  const handleSurveyChange = (e) => {
    const value = e.target.value;
    setSurveyId(value);
    handleFilterChange(airportId, value, agentId);
  };

  const handleAgentChange = (e) => {
    const value = e.target.value;
    setAgentId(value);
    handleFilterChange(airportId, surveyId, value);
  };

  const handleResetFilters = async () => {
    setAirportId('');
    setSurveyId('');
    setAgentId('');
    await fetchAllFeedback('', '', '');
  };

  const toggleExpandedFeedback = (feedbackId) => {
    setExpandedFeedbackId(expandedFeedbackId === feedbackId ? null : feedbackId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getFeedbackAnswersDisplay = (feedback) => {
    const surveyDefinition = surveyDefinitions.find(
      (survey) => Number(survey.surveyId) === Number(feedback.surveyId)
    );

    const questionRows = [];

    const surveyQuestionLabels = new Map(
      (surveyDefinition?.surveyQuestions || []).map((question) => [String(question.id), question.surveyQuestionText || `Question ${question.id}`])
    );

    const generalQuestionLabels = new Map(
      (surveyDefinition?.generalQuestions || []).map((question) => [String(question.id), question.questionText || `Question ${question.id}`])
    );

    const renderAnswerValue = (value, options = []) => {
      if (value === null || value === undefined || value === '') {
        return 'No response';
      }

      if (Array.isArray(value)) {
        return value.map((item) => renderAnswerValue(item, options)).join(', ');
      }

      if (typeof value === 'object') {
        if (value.label) {
          return value.label;
        }

        if (value.value) {
          return value.value;
        }

        return JSON.stringify(value);
      }

      if (options.length > 0) {
        const matchedOption = options.find((option) => String(option.id) === String(value) || String(option.value) === String(value));
        if (matchedOption) {
          return matchedOption.optionText || matchedOption.label || matchedOption.value || String(value);
        }
      }

      return String(value);
    };

    const addRowsFromAnswers = (answers, labels, prefix = '') => {
      if (!answers || typeof answers !== 'object') {
        return;
      }

      Object.entries(answers).forEach(([key, value]) => {
        const label = labels.get(String(key)) || `${prefix}Question ${key}`;
        const options = surveyDefinition?.generalQuestions?.find((question) => String(question.id) === String(key))?.options || [];

        questionRows.push({
          label,
          value: renderAnswerValue(value, options),
        });
      });
    };

    addRowsFromAnswers(feedback.answers, surveyQuestionLabels);
    addRowsFromAnswers(feedback.generalAnswers, generalQuestionLabels);

    if (feedback.reason) questionRows.push({ label: 'Reason for Travel', value: feedback.reason });
    if (feedback.aircraftClass) questionRows.push({ label: 'Aircraft Class', value: feedback.aircraftClass });
    if (feedback.returnTrips) questionRows.push({ label: 'Return Trips', value: feedback.returnTrips });

    if (feedback.additionalComment) {
      questionRows.push({ label: 'Additional Comment', value: feedback.additionalComment });
    }

    return questionRows;
  };

  return (
    <Layout>
      <div className="feedback-received-container">
      <h1 className="page-title">Feedback Received</h1>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="airport-filter">Airport:</label>
            <select
              id="airport-filter"
              value={airportId}
              onChange={handleAirportChange}
              className="filter-select"
            >
              <option value="">All Airports</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.id}>
                  {airport.name} ({airport.code})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="survey-filter">Survey:</label>
            <select
              id="survey-filter"
              value={surveyId}
              onChange={handleSurveyChange}
              className="filter-select"
            >
              <option value="">All Surveys</option>
              {surveys.map((survey) => (
                <option key={survey.id} value={survey.id}>
                  {survey.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="agent-filter">Agent:</label>
            <select
              id="agent-filter"
              value={agentId}
              onChange={handleAgentChange}
              className="filter-select"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleResetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <p className="total-feedback">Total Feedback Received: <strong>{totalFeedback}</strong></p>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading State */}
      {loading && <div className="loading-message">Loading feedback...</div>}

      {/* Feedback List */}
      {!loading && feedbackList.length > 0 ? (
        <div className="feedback-list">
          {feedbackList.map((feedback) => (
            <div key={feedback.feedbackResponseId} className="feedback-card">
              <div
                className="feedback-header"
                onClick={() => toggleExpandedFeedback(feedback.feedbackResponseId)}
              >
                <div className="feedback-summary">
                  <h3>{feedback.airportName} ({feedback.airportCode})</h3>
                  <p className="feedback-date">{formatDate(feedback.submittedAt)}</p>
                  <p className="feedback-location">
                    Location: {feedback.latitude.toFixed(4)}, {feedback.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="expand-icon">
                  {expandedFeedbackId === feedback.feedbackResponseId ? '▼' : '▶'}
                </div>
              </div>

              {expandedFeedbackId === feedback.feedbackResponseId && (
                <div className="feedback-details">
                  <div className="detail-row">
                    <strong>Airport ID:</strong>
                    <span>{feedback.airportId}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Survey ID:</strong>
                    <span>{feedback.surveyId}</span>
                  </div>
                  {surveyDefinitions.find((survey) => Number(survey.surveyId) === Number(feedback.surveyId)) && (
                    <div className="detail-row">
                      <strong>Survey Name:</strong>
                      <span>{surveyDefinitions.find((survey) => Number(survey.surveyId) === Number(feedback.surveyId))?.surveyName}</span>
                    </div>
                  )}
                  {feedback.agentId && (
                    <div className="detail-row">
                      <strong>Agent ID:</strong>
                      <span>{feedback.agentId}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <strong>Airport Region:</strong>
                    <span>{feedback.airportRegion}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Airport City:</strong>
                    <span>{feedback.airportCity}</span>
                  </div>

                  {/* Answers and Comments */}
                  <div className="answers-section">
                    {getFeedbackAnswersDisplay(feedback).map((item, idx) => (
                      <div key={idx} className="answer-item">
                        <strong>{item.label}:</strong>
                        <p className="answer-value">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="no-feedback-message">
            {airportId || surveyId || agentId
              ? 'No feedback found for the selected filters.'
              : 'No feedback received yet.'}
          </div>
        )
      )}
    </div>
      </Layout>
  );
}
