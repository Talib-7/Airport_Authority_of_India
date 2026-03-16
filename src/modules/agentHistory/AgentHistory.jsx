import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./agentHistory.css";
import agentService from "../auth/services/agentService";

const AgentHistory = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [historyList, setHistoryList] = useState([]);

  if (!currentUser || currentUser.roleId !== 1) {
    return (
      <Layout>
        <h2>Agent History</h2>
        <p>Access denied. Only admin can view this page.</p>
      </Layout>
    );
  }

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await agentService.getAgentHistory();
        setHistoryList(history);
      } catch (error) {
        console.error("Failed to load agent history", error);
        setHistoryList([]);
      }
    };

    loadHistory();
  }, []);

  return (
    <Layout>
      <h2>Agent History</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Agency Name</th>
            <th>Agency Code</th>
            <th>Delete Reason</th>
            <th>Deleted Date</th>
          </tr>
        </thead>

        <tbody>
          {historyList.length > 0 ? (
            historyList.map((item, index) => (
              <tr key={item.userId}>
                <td>{index + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.agencyName}</td>
                <td>{item.agencyCode}</td>
                <td>{item.rejectionReason}</td>
                <td>{item.rejectedAt ? new Date(item.rejectedAt).toLocaleString() : "-"}</td>
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

export default AgentHistory;