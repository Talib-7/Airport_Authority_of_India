import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import generalQuestionsService from "./services/generalQuestionsService";
import "./generalQuestions.css";

const GeneralQuestions = () => {

  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOption, setNewOption] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [questionType, setQuestionType] = useState("RADIO");
  const [expandedQuestionIds, setExpandedQuestionIds] = useState([]);

  const getQuestionKey = (item, index) => String(item?.id ?? index);

  const getQuestionOptions = (item) => (Array.isArray(item?.options) ? item.options : []);

  const hasOptions = (item) => getQuestionOptions(item).length > 0;

  const isQuestionExpanded = (questionKey) => expandedQuestionIds.includes(questionKey);

  const toggleQuestionOptions = (questionKey) => {
    setExpandedQuestionIds((currentIds) =>
      currentIds.includes(questionKey)
        ? currentIds.filter((id) => id !== questionKey)
        : [...currentIds, questionKey],
    );
  };

  const getOptionLabel = (option, optionIndex) =>
    option?.optionLabel || option?.optionValue || `Option ${optionIndex + 1}`;

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const questions = await generalQuestionsService.findAll();
      setQuestionsList(Array.isArray(questions) ? questions : []);
    } catch (fetchError) {
      const message = fetchError.response?.data?.message || "Failed to fetch general questions";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ADD OPTION
  const addOption = () => {
    if (newOption.trim() !== "") {
      setOptionList([...optionList, newOption]);
      setNewOption("");
    }
  };

  // REMOVE OPTION
  const removeOption = (index) => {
    const updated = optionList.filter((_, i) => i !== index);
    setOptionList(updated);
  };

  const saveQuestion = async () => {
    if (newQuestion.trim() === "") {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        questionText: newQuestion.trim(),
        questionType,
      };

      if (questionType === "RADIO") {
        payload.options = optionList
          .filter((option) => option.trim() !== "")
          .map((option) => ({
            optionLabel: option,
            optionValue: option,
          }));
      }

      await generalQuestionsService.create(payload);
      await fetchQuestions();

      setNewQuestion("");
      setNewOption("");
      setOptionList([]);
      setShowForm(false);
      setQuestionType("RADIO");
    } catch (saveError) {
      const message = saveError.response?.data?.message || "Failed to add question";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="page-header">
        <h2>General Questions</h2>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setNewQuestion("");
            setOptionList([]);
            setQuestionType("RADIO");
          }}
        >
          Add Question
        </button>
      </div>

      {error && (
        <div style={{ color: "#dc3545", marginBottom: "10px", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: "10px" }}>Loading...</div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="question-box">

          <input
            type="text"
            placeholder="Type your question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="question-input"
          />

          {/* QUESTION TYPE */}
          <div style={{ margin: "10px 0" }}>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="RADIO"
                checked={questionType === "RADIO"}
                onChange={(e) => {
                  setQuestionType(e.target.value);
                }}
              />
              Radio
            </label>

              {/* 
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="text"
                checked={questionType === "text"}
                onChange={(e) => {
                  setQuestionType(e.target.value);
                }}
              />
              Select/Dropdown
            </label>
            */ }

            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="TEXT"
                checked={questionType === "TEXT"}
                onChange={(e) => {
                  setQuestionType(e.target.value);
                  if (e.target.value === "TEXT") {
                    setOptionList([]);
                  }
                }}
              />
              Text
            </label>

            {/* <label>
              <input
                type="radio"
                value="RATING"
                checked={questionType === "RATING"}
                onChange={(e) => {
                  setQuestionType(e.target.value);
                  if (e.target.value === "TEXT" || e.target.value === "RATING") {
                    setOptionList([]);
                  }
                }}
              />
              Rating
            </label> */}
          </div>

          {/* OPTIONS (ONLY FOR RADIO TYPE) */}
          {questionType === "RADIO" && (
            <>
              <div className="option-row">
                <input
                  type="text"
                  placeholder="Options here"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="option-input"
                />

                <button
                  type="button"
                  className="plus-btn"
                  onClick={addOption}
                >
                  +
                </button>

                <button
                  type="button"
                  className="add-question-btn"
                  onClick={saveQuestion}
                >
                  Add Question
                </button>
              </div>

              {optionList.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {optionList.map((opt, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f4f4f4",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        marginBottom: "5px"
                      }}
                    >
                      <span>• {opt}</span>

                      <button
                        onClick={() => removeOption(i)}
                        style={{
                          background: "#dc3545",
                          border: "none",
                          color: "white",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* SAVE BUTTON FOR TEXT TYPE */}
          {questionType === "TEXT" && (
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="add-question-btn"
                onClick={saveQuestion}
              >
                Add Question
              </button>
            </div>
          )}

        </div>
      )}

      {/* TABLE */}
      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Question</th>
            <th>Type</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody>
          {questionsList.length > 0 ? (
            questionsList.map((item, index) => {
              const questionKey = getQuestionKey(item, index);
              const itemOptions = getQuestionOptions(item);
              const canExpand = hasOptions(item);
              const expanded = isQuestionExpanded(questionKey);

              return (
                <tr key={item.id || questionKey}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.questionText}</strong>
                  </td>

                  <td>{item.questionType}</td>
                  <td>
                    {canExpand ? (
                      <div className="options-accordion">
                        <button
                          type="button"
                          className="options-toggle-btn"
                          onClick={() => toggleQuestionOptions(questionKey)}
                          aria-expanded={expanded}
                          aria-label={`Toggle options for question ${index + 1}`}
                        >
                          <span className={`options-toggle-icon ${expanded ? "expanded" : ""}`}>
                            +
                          </span>
                          <span className="options-toggle-text">View options ({itemOptions.length})</span>
                        </button>

                        {expanded ? (
                          <div className="options-panel">
                            {itemOptions.map((option, optionIndex) => (
                              <span key={option.id || `${questionKey}-${optionIndex}`} className="option-chip">
                                {getOptionLabel(option, optionIndex)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <span className="no-options">-</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="no-record">
                No Record Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </Layout>
  );
};

export default GeneralQuestions;