import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./registeredAgents.css";
import agentService from "../auth/services/agentService";

const RegisteredAgents = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [users, setUsers] = useState([]);
  const [successMsg, setSuccessMsg] = useState(""); // 🔥 Success message state

  if (!currentUser || currentUser.roleId !== 1) {
    return (
      <Layout>
        <h2>Registered Agents</h2>
        <p>Access denied. Only admin can view this page.</p>
      </Layout>
    );
  }

  useEffect(() => {
    const loadPending = async () => {
      try {
        const pending = await agentService.getPendingAgents();
        setUsers(pending);
      } catch (error) {
        console.error("Failed to load pending agents", error);
        setUsers([]);
      }
    };

    loadPending();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await agentService.approveAgent(userId);
      const updatedUsers = users.filter((user) => user.userId !== userId);
      setUsers(updatedUsers);
      setSuccessMsg("Agent Approved Successfully!");
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Approval failed";
      alert(Array.isArray(message) ? message.join(", ") : message);
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await agentService.rejectAgent(userId, reason);
      const updatedUsers = users.filter((user) => user.userId !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      const message = error.response?.data?.message || "Rejection failed";
      alert(Array.isArray(message) ? message.join(", ") : message);
    }
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
      <tr key={user.userId}>
        <td>{index + 1}</td>
        <td>{user.fullName}</td>
        <td>{user.email}</td>
        <td>{user.mobile}</td>
        <td>{user.agencyName}</td>
        <td>{user.agencyCode}</td>

        <td>
          <button
            className="view-btn"
            onClick={() => previewFile(`http://localhost:3000${user.idDocumentUrl}`)}
          >
            View ID
          </button>
        </td>

        <td>
          <button
            className="approve-btn"
            onClick={() => handleApprove(user.userId)}
          >
            Approve
          </button>

          <button
            className="reject-btn"
            onClick={() => handleReject(user.userId)}
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