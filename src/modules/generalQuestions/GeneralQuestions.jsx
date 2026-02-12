import { useState } from "react";
import Layout from "../layout/Layout";
import "./generalQuestions.css";

const GeneralQuestions = () => {

  const [questionsList, setQuestionsList] = useState([
    {
      question: "How was your airport experience?",
      options: ["Good", "Average", "Bad"],
      isLive: true,
      surveys: ["Passenger Survey 2024", "Service Quality Survey"]
    },
    {
      question: "Was staff helpful?",
      options: ["Yes", "No"],
      isLive: false,
      surveys: []
    }
  ]);

  // FORM STATES
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOption, setNewOption] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // 🔥 EDIT MODE

  // STATUS TOGGLE
  const toggleStatus = (index) => {
    const updated = [...questionsList];
    updated[index].isLive = !updated[index].isLive;

    if (!updated[index].isLive) {
      updated[index].surveys = [];
    } else {
      updated[index].surveys = ["New Live Survey"];
    }

    setQuestionsList(updated);
  };

  // DELETE
  const deleteQuestion = (index) => {
    const updated = questionsList.filter((_, i) => i !== index);
    setQuestionsList(updated);
  };

  // OPEN EDIT MODE
  const handleUpdate = (item, index) => {
    if (item.isLive) {
      alert("Stop the survey first before updating.");
      return;
    }

    setShowForm(true);
    setNewQuestion(item.question);
    setOptionList(item.options);
    setEditIndex(index);
  };

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

  // SAVE (ADD OR UPDATE)
  const saveQuestion = () => {
    if (newQuestion.trim() === "") return;

    if (editIndex !== null) {
      // UPDATE MODE
      const updated = [...questionsList];
      updated[editIndex].question = newQuestion;
      updated[editIndex].options = optionList;
      setQuestionsList(updated);
    } else {
      // ADD MODE
      setQuestionsList([
        ...questionsList,
        {
          question: newQuestion,
          options: optionList,
          isLive: false,
          surveys: []
        }
      ]);
    }

    // RESET
    setNewQuestion("");
    setNewOption("");
    setOptionList([]);
    setEditIndex(null);
    setShowForm(false);
  };

  return (
    <Layout>

      <div className="page-header">
        <h2>General Questions</h2>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditIndex(null);
            setNewQuestion("");
            setOptionList([]);
          }}
        >
          Add Question
        </button>
      </div>

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
              {editIndex !== null ? "Update Question" : "Add Question"}
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

        </div>
      )}

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Question</th>
            <th>Status</th>
            <th>Live In</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {questionsList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>
                <strong>{item.question}</strong>
                {item.options.map((opt, i) => (
                  <div key={i}>• {opt}</div>
                ))}
              </td>

              <td>
                <span className={item.isLive ? "badge green" : "badge red"}>
                  {item.isLive ? "Live" : "Stopped"}
                </span>

                <button
                  className="status-btn"
                  onClick={() => toggleStatus(index)}
                >
                  {item.isLive ? "Stop" : "Start"}
                </button>
              </td>

              <td>
                {item.isLive ? (
                  <button
                    className="view-btn"
                    onClick={() =>
                      alert("Live In:\n" + item.surveys.join("\n"))
                    }
                  >
                    View Surveys
                  </button>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleUpdate(item, index)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  disabled={item.isLive}
                  onClick={() => deleteQuestion(index)}
                  style={{
                    opacity: item.isLive ? 0.5 : 1,
                    cursor: item.isLive ? "not-allowed" : "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </Layout>
  );
};

export default GeneralQuestions;
