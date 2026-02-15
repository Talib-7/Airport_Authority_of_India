import { useState } from "react";
import Layout from "../layout/Layout";
import "./approvedUsers.css";

const ApprovedUsers = () => {

  const [userList, setUserList] = useState([
    {
      name: "Talib Hussain",
      email: "talib@gmail.com",
      mobile: "9876543210",
      agencyName: "Sky Agents",
      agencyCode: "AG-101",
      surveys: ["Passenger Feedback 2024", "Security Survey"]
    }
  ]);

  // 🔥 Modal State
  const [activeUserIndex, setActiveUserIndex] = useState(null);

  // 🔥 Stop Single Survey
  const stopSurvey = (surveyIndex) => {
    const updated = [...userList];
    updated[activeUserIndex].surveys.splice(surveyIndex, 1);
    setUserList(updated);
  };

  // 🔥 Stop All Surveys
  const stopAllSurveys = () => {
    const updated = [...userList];
    updated[activeUserIndex].surveys = [];
    setUserList(updated);
  };

  // 🔥 Delete User
  const deleteUser = (index) => {
    const updated = userList.filter((_, i) => i !== index);
    setUserList(updated);
  };

  return (
    <Layout>

      <h2>Approved Users</h2>

      <table className="approved-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Agency Name</th>
            <th>Agency Code</th>
            <th>Assigned Surveys</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.mobile}</td>
              <td>{item.agencyName}</td>
              <td>{item.agencyCode}</td>

              {/* 🔥 View Surveys Button */}
              <td>
                {item.surveys.length > 0 ? (
                  <button
                    className="view-btn"
                    onClick={() => setActiveUserIndex(index)}
                  >
                    View Surveys
                  </button>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <button
                  className="delete-btn"
                  disabled={item.surveys.length > 0}
                  onClick={() => deleteUser(index)}
                  style={{
                    opacity: item.surveys.length > 0 ? 0.5 : 1,
                    cursor: item.surveys.length > 0 ? "not-allowed" : "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 Survey Modal */}
      {activeUserIndex !== null && (
        <div className="survey-modal">
          <div className="survey-modal-box">

            <h3>Assigned Surveys</h3>

            {userList[activeUserIndex].surveys.map((survey, i) => (
              <div key={i} className="survey-item">
                <span>{survey}</span>

                <button
                  className="stop-btn"
                  onClick={() => stopSurvey(i)}
                >
                  Stop
                </button>
              </div>
            ))}

            {userList[activeUserIndex].surveys.length > 0 && (
              <button
                className="stop-all-btn"
                onClick={stopAllSurveys}
              >
                Stop All
              </button>
            )}

            <button
              className="close-btn"
              onClick={() => setActiveUserIndex(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default ApprovedUsers;
