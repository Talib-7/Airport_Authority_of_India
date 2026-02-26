import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./registeredAgents.css";

const RegisteredAgents = () => {

  const [users, setUsers] = useState([]);
  const [successMsg, setSuccessMsg] = useState(""); // 🔥 Success message state

  useEffect(() => {
    const storedUsers =
      JSON.parse(localStorage.getItem("registeredAgents")) || [];
    setUsers(storedUsers);
  }, []);

  const handleApprove = (index) => {
    const user = users[index];

    // Move to Approved
    const approved =
      JSON.parse(localStorage.getItem("approvedAgents")) || [];

    localStorage.setItem(
      "approvedAgents",
      JSON.stringify([...approved, user])
    );

    // Remove from Registered
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem("registeredAgents", JSON.stringify(updatedUsers));

    // 🔥 Show Success Message
    setSuccessMsg("Agent Approved Successfully!");

    // 🔥 Auto remove message after 2 seconds
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  const handleReject = (index) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem("registeredAgents", JSON.stringify(updatedUsers));
  };

  const previewFile = (fileData) => {
    const newWindow = window.open();
    newWindow.document.write(`
      <iframe 
        src="${fileData}" 
        frameborder="0" 
        style="width:100%; height:100vh;"
      ></iframe>
    `);
  };

  return (
    <Layout>
      <h2>Registered Agents</h2>

      {/* 🔥 Success Message */}
      {successMsg && (
        <div className="success-message">
          {successMsg}
        </div>
      )}

      <table className="registered-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Agency Name</th>
            <th>Agency Code</th>
            <th>Upload ID</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
  {users.length > 0 ? (
    users.map((user, index) => (
      <tr key={user.id}>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.mobile}</td>
        <td>{user.agencyName}</td>
        <td>{user.agencyCode}</td>

        <td>
          <button
            className="view-btn"
            onClick={() => previewFile(user.uploadId)}
          >
            View ID
          </button>
        </td>

        <td>
          <button
            className="approve-btn"
            onClick={() => handleApprove(index)}
          >
            Approve
          </button>

          <button
            className="reject-btn"
            onClick={() => handleReject(index)}
          >
            Reject
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="no-record">
        No Record Found
      </td>
    </tr>
  )}
</tbody>
      </table>
    </Layout>
  );
};

export default RegisteredAgents;