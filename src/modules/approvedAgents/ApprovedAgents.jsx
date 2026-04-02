import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./approvedAgents.css";
import agentService from "../auth/services/agentService";

const ApprovedAgents = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [userList, setUserList] = useState([]);

  if (!currentUser || currentUser.roleId !== 1) {
    return (
      <Layout>
        <h2>Approved Agents</h2>
        <p>Access denied. Only admin can view this page.</p>
      </Layout>
    );
  }

  useEffect(() => {
    const loadApproved = async () => {
      try {
        const approved = await agentService.getApprovedAgents();
        setUserList(approved);
      } catch (error) {
        console.error("Failed to load approved agents", error);
        setUserList([]);
      }
    };

    loadApproved();
  }, []);

  const deleteUser = async (userId) => {

    const reason = prompt("Enter reason for deleting this agent:");
    if (!reason) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
    if (!confirmDelete) return;

    try {
      await agentService.rejectAgent(userId, reason);
      const updated = userList.filter((user) => user.userId !== userId);
      setUserList(updated);
    } catch (error) {
      const message = error.response?.data?.message || "Delete failed";
      alert(Array.isArray(message) ? message.join(", ") : message);
    }
  };

  return (
    <Layout>
      <h2>Approved Agents</h2>

      <table className="approved-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Agency Name</th>
            <th>Agency Code</th>
            <th>Auto Password</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userList.length > 0 ? (
            userList.map((item, index) => (
              <tr key={item.userId}>
                <td>{index + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.agencyName}</td>
                <td>{item.agencyCode}</td>
                <td>{item.generatedPassword || "-"}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(item.userId)}
                  >
                    Delete
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

export default ApprovedAgents;