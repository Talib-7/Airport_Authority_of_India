import { useState } from "react";
import Layout from "../layout/Layout";
import "./surveyRunning.css";

const SurveyRunning = () => {

  // Dummy Question Bank (Assume saved questions)
  const allQuestions = [
    "How was your airport experience?",
    "Was staff helpful?",
    "Rate cleanliness",
    "Rate security service"
  ];

  const [surveyList, setSurveyList] = useState([
    {
      surveyId: "SRV-101",
      surveyName: "Passenger Feedback 2024",
      startDate: "01-01-2024",
      endDate: "31-12-2024",
      isRunning: true,
      questions: ["How was your airport experience?"]
    },
    {
      surveyId: "SRV-102",
      surveyName: "Service Quality Survey",
      startDate: "01-02-2024",
      endDate: "30-06-2024",
      isRunning: false,
      questions: ["Was staff helpful?"]
    }
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  const toggleSurvey = (index) => {
    const updated = [...surveyList];
    updated[index].isRunning = !updated[index].isRunning;
    setSurveyList(updated);
  };

  const openEdit = (index) => {
    if (surveyList[index].isRunning) {
      alert("Stop the survey before editing.");
      return;
    }
    setEditIndex(index);
  };

  const removeQuestion = (qIndex) => {
    const updated = [...surveyList];
    updated[editIndex].questions.splice(qIndex, 1);
    setSurveyList(updated);
  };

  const addQuestionToSurvey = (question) => {
    const updated = [...surveyList];
    updated[editIndex].questions.push(question);
    setSurveyList(updated);
  };

  return (
    <Layout>

      <div className="page-header">
        <h2>Survey Running</h2>
      </div>

      <table className="survey-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Survey Id</th>
            <th>Survey Name</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {surveyList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.surveyId}</td>
              <td>{item.surveyName}</td>

              {/* STATUS BADGE */}
              <td>
                <span className={item.isRunning ? "badge green" : "badge red"}>
                  {item.isRunning ? "Live" : "Stopped"}
                </span>
              </td>

              <td>{item.startDate}</td>
              <td>{item.endDate}</td>

              <td>
                <button
                  className="survey-status-btn"
                  onClick={() => toggleSurvey(index)}
                >
                  {item.isRunning ? "Stop" : "Start"}
                </button>

                <button
                  className="edit-btn"
                  style={{ marginLeft: "8px" }}
                  onClick={() => openEdit(index)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT PANEL */}
      {editIndex !== null && (
        <div className="question-box" style={{ marginTop: "20px" }}>
          <h3>Edit Survey Questions</h3>

          {surveyList[editIndex].questions.map((q, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px"
              }}
            >
              <span>• {q}</span>

              <button
                onClick={() => removeQuestion(i)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="add-btn"
            style={{ marginTop: "10px" }}
            onClick={() => setShowQuestionBank(!showQuestionBank)}
          >
            Add Question
          </button>

          {/* QUESTION BANK */}
          {showQuestionBank && (
            <div style={{ marginTop: "10px" }}>
              {allQuestions
                .filter(
                  (q) =>
                    !surveyList[editIndex].questions.includes(q)
                )
                .map((q, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px"
                    }}
                  >
                    <span>{q}</span>
                    <button
                      onClick={() => addQuestionToSurvey(q)}
                      style={{
                        background: "#0b1853",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

    </Layout>
  );
};

export default SurveyRunning;
