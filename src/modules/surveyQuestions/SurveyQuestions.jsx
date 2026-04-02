import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import useSurveyQuestionsStore from "./stores/surveyQuestionsStore";
import "./surveyQuestions.css";

const SurveyQuestions = () => {
  // Store
  const { 
    surveyQuestions, 
    loading, 
    error, 
    fetchSurveyQuestions, 
    createSurveyQuestion, 
    updateSurveyQuestion, 
    deleteSurveyQuestion,
    clearError 
  } = useSurveyQuestionsStore();

  // FORM STATES
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [editId, setEditId] = useState(null); // 🔥 EDIT MODE

  // Fetch questions on mount
  useEffect(() => {
    fetchSurveyQuestions();
  }, [fetchSurveyQuestions]);

  // STATUS TOGGLE
  const toggleStatus = async (id) => {
    const question = surveyQuestions.find(q => q.surveyQuestionId === id);
    if (!question) return;

    const updatedStatus = !question.status;
    const result = await updateSurveyQuestion(id, { status: updatedStatus });
    
    if (!result.success) {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  // DELETE
  const handleDelete = async (id, isLive) => {
    if (isLive) {
      alert("Stop the survey first before deleting.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this question?")) {
      const result = await deleteSurveyQuestion(id);
      
      if (!result.success) {
        alert(`Failed to delete question: ${result.error}`);
      }
    }
  };

  // OPEN EDIT MODE
  const handleUpdate = (item) => {
    if (item.status) {
      alert("Stop the survey first before updating.");
      return;
    }

    setShowForm(true);
    setNewQuestion(item.surveyQuestionText || "");
    setEditId(item.surveyQuestionId);
  };

  // SAVE (ADD OR UPDATE)
  const saveQuestion = async () => {
    if (newQuestion.trim() === "") {
      alert("Question text is required");
      return;
    }

    const questionData = {
      surveyQuestionText: newQuestion,
    };

    let result;
    if (editId !== null) {
      // UPDATE MODE
      result = await updateSurveyQuestion(editId, questionData);
    } else {
      // ADD MODE
      result = await createSurveyQuestion(questionData);
    }

    if (result.success) {
      // RESET
      setNewQuestion("");
      setEditId(null);
      setShowForm(false);
    } else {
      alert(`Failed to save question: ${result.error}`);
    }
  };

  return (
    <Layout>

      <div className="page-header">
        <h2>Survey Questions</h2>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setNewQuestion("");
          }}
        >
          Add Question
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div style={{
          background: "#f8d7da",
          color: "#721c24",
          padding: "12px",
          borderRadius: "4px",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span>{error}</span>
          <button
            onClick={clearError}
            style={{
              background: "transparent",
              border: "none",
              color: "#721c24",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <span>Loading...</span>
        </div>
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

          <button
            type="button"
            className="add-question-btn"
            onClick={saveQuestion}
            style={{ marginTop: "10px" }}
          >
            {editId !== null ? "Update Question" : "Add Question"}
          </button>

        </div>
      )}

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Question</th>
            {/* <th>Status</th> */}
            {/* <th>Live In</th> */}
            {/* <th>Actions</th> */}
          </tr>
        </thead>

        <tbody>
          {surveyQuestions.length === 0 && !loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No questions found. Add your first question!
              </td>
            </tr>
          ) : (
            surveyQuestions.map((item, index) => (
              <tr key={item.surveyQuestionId}>
                <td>{index + 1}</td>

                <td>
                  <strong>{item.surveyQuestionText}</strong>
                </td>

                {/* <td>
                  <span className={item.status ? "badge green" : "badge red"}>
                    {item.status ? "Live" : "Stopped"}
                  </span>

                  <button
                    className="status-btn"
                    onClick={() => toggleStatus(item.surveyQuestionId)}
                  >
                    {item.status ? "Stop" : "Start"}
                  </button>
                </td> */}

                {/* <td>
                  {item.status ? (
                    <button
                      className="view-btn"
                      onClick={() =>
                        alert("Live In:\n" + (item.surveys ? item.surveys.join("\n") : "No active surveys"))
                      }
                    >
                      View Surveys
                    </button>
                  ) : (
                    "-"
                  )}
                </td> */}

                {/* <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdate(item)}
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    disabled={item.status}
                    onClick={() => handleDelete(item.surveyQuestionId, item.status)}
                    style={{
                      opacity: item.status ? 0.5 : 1,
                      cursor: item.status ? "not-allowed" : "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>

    </Layout>
  );
};

export default SurveyQuestions;
