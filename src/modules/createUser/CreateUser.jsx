import { useState } from "react";
import Layout from "../layout/Layout";
import "./createUser.css";

const CreateUser = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    mobile: "",
    forType: "",
    airport: "",
    region: ""
  });

  const airports = [
    "Indira Gandhi International Airport",
    "Chhatrapati Shivaji Maharaj Airport",
    "Kempegowda International Airport"
  ];

  const regions = [
    "North",
    "South",
    "East",
    "West"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    alert("User Created Successfully!");
    console.log(formData);
  };

  return (
    <Layout>

      <h2>Create User</h2>

      <div className="create-user-form">

        {/* Row 1 */}
        <div className="form-row">

          <div className="field-wrapper">
            <label>Name of User:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name of the user"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrapper">
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address of the user"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Row 2 */}
        <div className="form-row">

          <div className="field-wrapper">
            <label>Designation:</label>
            <input
              type="text"
              name="designation"
              placeholder="Enter Designation of the user"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrapper">
            <label>Mobile Number:</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile no. of the user"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* For */}
        <div className="form-row">
          <label>For:</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="forType"
                value="airport"
                onChange={handleChange}
              />
              Airport
            </label>

            <label>
              <input
                type="radio"
                name="forType"
                value="region"
                onChange={handleChange}
              />
              Region
            </label>
          </div>
        </div>

        {/* Conditional Dropdowns */}

        {formData.forType === "airport" && (
          <div className="form-row">
            <div className="field-wrapper">
              <label>Select Airport</label>
              <select
                name="airport"
                value={formData.airport}
                onChange={handleChange}
              >
                <option value="">Select Airport</option>
                {airports.map((airport, index) => (
                  <option key={index} value={airport}>
                    {airport}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {formData.forType === "region" && (
          <div className="form-row">
            <div className="field-wrapper">
              <label>Select Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Select Region</option>
                {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Button */}
        <div className="form-row">
          <button className="create-btn" onClick={handleSubmit}>
            Create
          </button>
        </div>

      </div>

    </Layout>
  );
};

export default CreateUser;
