import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./approvedAgents.css";

const ApprovedAgents = () => {

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const storedApproved = JSON.parse(localStorage.getItem("approvedAgents")) || [];
    setUserList(storedApproved);
  }, []);

  const deleteUser = (index) => {

    const reason = prompt("Enter reason for deleting this agent:");
    if (!reason) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
    if (!confirmDelete) return;

    const userToDelete = userList[index];

    // 🔥 Get existing history
    const history = JSON.parse(localStorage.getItem("agentHistory")) || [];

    // 🔥 Create history object
    const deletedAgent = {
      ...userToDelete,
      deletedReason: reason,
      deletedDate: new Date().toLocaleString()
    };

    // 🔥 Save to history
    localStorage.setItem(
      "agentHistory",
      JSON.stringify([...history, deletedAgent])
    );

    // 🔥 Remove from Approved
    const updated = userList.filter((_, i) => i !== index);
    setUserList(updated);
    localStorage.setItem("approvedAgents", JSON.stringify(updated));
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userList.length > 0 ? (
            userList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.agencyName}</td>
                <td>{item.agencyCode}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-record">
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