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
      agencyCode: "AG-101"
    }
  ]);

  // 🔥 Delete User (Direct Delete)
  const deleteUser = (index) => {

     const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

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

              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(index)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </Layout>
  );
};

export default ApprovedUsers;