import { useState } from "react";
import Layout from "../layout/Layout";
import "./generalQuestions.css";

const GeneralQuestions = () => {

  const [questionsList, setQuestionsList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOption, setNewOption] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [questionType, setQuestionType] = useState("radio"); // NEW STATE

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

    const questionObject = {
      question: newQuestion,
      type: questionType,
      options: questionType === "radio" ? optionList : []
    };

    if (editIndex !== null) {
      const updated = [...questionsList];
      updated[editIndex] = questionObject;
      setQuestionsList(updated);
    } else {
      setQuestionsList([...questionsList, questionObject]);
    }

    // RESET
    setNewQuestion("");
    setNewOption("");
    setOptionList([]);
    setEditIndex(null);
    setShowForm(false);
    setQuestionType("radio");
  };

  // DELETE
  const deleteQuestion = (index) => {
    const updated = questionsList.filter((_, i) => i !== index);
    setQuestionsList(updated);
  };

  // EDIT
  const handleUpdate = (item, index) => {
    setShowForm(true);
    setNewQuestion(item.question);
    setOptionList(item.options || []);
    setQuestionType(item.type || "radio");
    setEditIndex(index);
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
            setQuestionType("radio");
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

          {/* QUESTION TYPE */}
          <div style={{ margin: "10px 0" }}>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="radio"
                checked={questionType === "radio"}
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
                  if (e.target.value === "TEXT" || e.target.value === "RATING") {
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
          {questionType === "radio" && (
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
            </>
          )}

          {/* SAVE BUTTON FOR TEXT TYPE */}
          {questionType === "text" && (
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="add-question-btn"
                onClick={saveQuestion}
              >
                {editIndex !== null ? "Update Question" : "Add Question"}
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
            <th>Sr. No.</th>
            <th>Question</th>
            <th>Type</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>

        <tbody>
          {questionsList.length > 0 ? (
            questionsList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                {/* QUESTION COLUMN */}
                <td>
                  <strong>{item.question}</strong>

                  {item.type === "radio" &&
                    item.options.map((opt, i) => (
                      <div key={i}>• {opt}</div>
                    ))}
                </td>

                {/* TYPE COLUMN */}
                <td>{item.type}</td>

                {/* ACTIONS */}
                {/* <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdate(item, index)}
                  >
                    Update
                  </button> 

                  <button
                    className="delete-btn"
                    onClick={() => deleteQuestion(index)}
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))
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