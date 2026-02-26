import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./agentHistory.css";

const AgentHistory = () => {

  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("agentHistory")) || [];
    setHistoryList(storedHistory);
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
          {historyList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.mobile}</td>
              <td>{item.agencyName}</td>
              <td>{item.agencyCode}</td>
              <td>{item.deletedReason}</td>
              <td>{item.deletedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default AgentHistory;