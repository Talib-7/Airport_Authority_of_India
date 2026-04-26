import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./approvedAgents.css";
import agentService from "../auth/services/agentService";

const ApprovedAgents = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [userList, setUserList] = useState([]);
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
    reason: "",
  });

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

  const openRejectModal = (user) => {
    setRejectModal({
      isOpen: true,
      userId: user.userId,
      userName: user.fullName,
      reason: "",
    });
  };

  const closeRejectModal = () => {
    setRejectModal({
      isOpen: false,
      userId: null,
      userName: "",
      reason: "",
    });
  };

  const deleteUser = async () => {
    const reason = rejectModal.reason.trim();
    if (!reason) {
      alert("Reason is required");
      return;
    }

    try {
      await agentService.rejectAgent(rejectModal.userId, reason);
      const updated = userList.filter((user) => user.userId !== rejectModal.userId);
      setUserList(updated);
      closeRejectModal();
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
            <th>Airport</th>
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
                <td>{item.airportName || "-"}</td>
                <td>{item.generatedPassword || "-"}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => openRejectModal(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-record">
                No Record Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {rejectModal.isOpen && (
        <div className="agent-action-modal-overlay" onClick={closeRejectModal}>
          <div className="agent-action-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Remove Approved Agent</h3>
            <p>
              This will move <strong>{rejectModal.userName}</strong> to rejected history. Enter reason.
            </p>

            <textarea
              className="agent-action-reason"
              value={rejectModal.reason}
              onChange={(event) =>
                setRejectModal((current) => ({ ...current, reason: event.target.value }))
              }
              placeholder="Enter reason"
            />

            <div className="agent-action-modal-footer">
              <button className="delete-btn" onClick={deleteUser}>Confirm Remove</button>
              <button className="modal-cancel-btn" onClick={closeRejectModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ApprovedAgents;