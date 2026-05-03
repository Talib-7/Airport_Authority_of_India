import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./approvedAgents.css";
import agentService from "../auth/services/agentService";

const ApprovedAgents = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [userList, setUserList] = useState([]);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
    actionType: "block",
    reason: "",
  });

  useEffect(() => {
    if (!currentUser || currentUser.roleId !== 1) {
      return;
    }

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

  if (!currentUser || currentUser.roleId !== 1) {
    return (
      <Layout>
        <h2>Approved Agents</h2>
        <p>Access denied. Only admin can view this page.</p>
      </Layout>
    );
  }

  const openActionModal = (user) => {
    setActionModal({
      isOpen: true,
      userId: user.userId,
      userName: user.fullName,
      actionType: user.isBlocked ? "unblock" : "block",
      reason: "",
    });
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      userId: null,
      userName: "",
      actionType: "block",
      reason: "",
    });
  };

  const submitAction = async () => {
    try {
      const response =
        actionModal.actionType === "block"
          ? await agentService.blockAgent(
              actionModal.userId,
              actionModal.reason.trim() || undefined,
            )
          : await agentService.unblockAgent(actionModal.userId);

      setUserList((current) =>
        current.map((user) =>
          user.userId === actionModal.userId ? response.agent : user,
        ),
      );
      closeActionModal();
    } catch (error) {
      const message = error.response?.data?.message || "Agent action failed";
      alert(Array.isArray(message) ? message.join(", ") : message);
    }
  };

  const statusLabel = (user) => (user.isBlocked ? "Blocked" : "Approved");

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
            <th>Status</th>
            <th>Block Reason</th>
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
                  <span className={item.isBlocked ? "status-pill status-blocked" : "status-pill status-approved"}>
                    {statusLabel(item)}
                  </span>
                </td>
                <td>{item.blockReason || "-"}</td>
                <td>
                  <button
                    className={item.isBlocked ? "unblock-btn" : "block-btn"}
                    onClick={() => openActionModal(item)}
                  >
                    {item.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (!window.confirm(`Delete ${item.fullName}? This cannot be undone.`)) return;
                      try {
                        await agentService.deleteAgent(item.userId);
                        setUserList((current) => current.filter((u) => u.userId !== item.userId));
                      } catch (error) {
                        const message = error.response?.data?.message || 'Delete failed';
                        alert(Array.isArray(message) ? message.join(', ') : message);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="no-record">
                No Record Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {actionModal.isOpen && (
        <div className="agent-action-modal-overlay" onClick={closeActionModal}>
          <div className="agent-action-modal" onClick={(event) => event.stopPropagation()}>
            <h3>{actionModal.actionType === "block" ? "Block Approved Agent" : "Unblock Agent"}</h3>
            <p>
              {actionModal.actionType === "block" ? (
                <>
                  Blocking <strong>{actionModal.userName}</strong> will prevent account access. Add an optional reason below.
                </>
              ) : (
                <>
                  This will restore access for <strong>{actionModal.userName}</strong>.
                </>
              )}
            </p>

            {actionModal.actionType === "block" && (
              <textarea
                className="agent-action-reason"
                value={actionModal.reason}
                onChange={(event) =>
                  setActionModal((current) => ({ ...current, reason: event.target.value }))
                }
                placeholder="Optional blocking reason"
              />
            )}

            <div className="agent-action-modal-footer">
              <button
                className={actionModal.actionType === "block" ? "block-btn" : "unblock-btn"}
                onClick={submitAction}
              >
                {actionModal.actionType === "block" ? "Confirm Block" : "Confirm Unblock"}
              </button>
              <button className="modal-cancel-btn" onClick={closeActionModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ApprovedAgents;
