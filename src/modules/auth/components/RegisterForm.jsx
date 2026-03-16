import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {

  const navigate = useNavigate(); // 🔥 Added

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    agencyName: "",
    airport: "",
    uploadId: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "uploadId" && files[0]) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({
          ...formData,
          uploadId: reader.result
        });
      };

      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      agencyName: formData.agencyName,
      agencyCode: "AG-" + Math.floor(Math.random() * 1000),
      uploadId: formData.uploadId,
      surveys: [],
      status: "Pending"
    };

    const existingUsers =
      JSON.parse(localStorage.getItem("registeredAgents")) || [];

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("registeredAgents", JSON.stringify(updatedUsers));

    alert("Registration Successful!");

    // 🔥 Redirect to Login Page After OK
    // navigate("/");

    // Reset form
    setFormData({
      name: "",
      email: "",
      mobile: "",
      agencyName: "",
      airport: "",
      uploadId: ""
    });
  };

  return (
    <form className="register-box" onSubmit={handleSubmit}>
      <h2 className="form-title">Agent Registration</h2>
      <p className="form-subtitle">
        Please fill in the form to create your account
      </p>

      <div className="field">
        <label>Full Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="field">
        <label>E-mail:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your e-mail address"
          required
        />
      </div>

      <div className="field">
        <label>Mobile No.:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter your mobile no."
          required
        />
      </div>

      <div className="field">
        <label>Company Name:</label>
        <input
          type="text"
          name="agencyName"
          value={formData.agencyName}
          onChange={handleChange}
          placeholder="Enter your company name"
          required
        />
      </div>

      <div className="field">
        <label>Upload Id:</label>
        <input
          type="file"
          name="uploadId"
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label>Airport Name:</label>
        <select
          name="airport"
          value={formData.airport}
          onChange={handleChange}
          required
        >
          <option value="">Select Airport</option>
          <option>Delhi (DEL)</option>
          <option>Mumbai (BOM)</option>
          <option>Bengaluru (BLR)</option>
        </select>
      </div>

      <button type="submit" className="login-btn">
        Register
      </button>

      <div className="register">
        <Link to="/">Back to Login</Link>
      </div>
    </form>
  );
};

export default RegisterForm;