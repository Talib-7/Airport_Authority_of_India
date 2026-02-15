import { useState } from "react";
import Layout from "../layout/Layout";
import "./registeredUsers.css";

const RegisteredUsers = () => {

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Talib Hussain",
      email: "talib@gmail.com",
      mobile: "9876543210",
      agencyName: "Sky Agents",
      agencyCode: "AG-101",
      uploadId: "aadhaar.pdf",
      surveys: [],
      status: "Pending"
    }
  ]);

  const [approvedUsers, setApprovedUsers] = useState([]);

  const handleApprove = (index) => {
    const user = users[index];
    setApprovedUsers([...approvedUsers, { ...user, status: "Approved" }]);
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleReject = (index) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    alert("User Rejected\nReason: " + reason);
    setUsers(users.filter((_, i) => i !== index));
  };

  const previewFile = (fileName) => {
    alert("Preview File: " + fileName);
  };

  return (
    <Layout>
      <h2>Registered Users</h2>

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
          {users.map((user, index) => (
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
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default RegisteredUsers;
