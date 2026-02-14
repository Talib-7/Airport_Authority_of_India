import { useState } from "react";
import Layout from "../layout/Layout";
import "./airports.css";

const Airports = () => {

  const [airportList, setAirportList] = useState([
    {
      name: "Indira Gandhi International Airport",
      type: "International",
      city: "Delhi",
      code: "DEL",
      region: "North",
      coordinates: "28.5562° N, 77.1000° E",
      surveys: ["Passenger Feedback 2024", "Security Survey"]
    },
    {
      name: "Chhatrapati Shivaji Maharaj Airport",
      type: "International",
      city: "Mumbai",
      code: "BOM",
      region: "West",
      coordinates: "19.0896° N, 72.8656° E",
      surveys: []
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    city: "",
    code: "",
    region: "",
    coordinates: ""
  });

  const [editIndex, setEditIndex] = useState(null);

  // 🔥 NEW: Toggle Form State
  const [showForm, setShowForm] = useState(false);

  const [activeAirportIndex, setActiveAirportIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.city) return;

    if (editIndex !== null) {
      const updated = [...airportList];
      updated[editIndex] = {
        ...formData,
        surveys: airportList[editIndex].surveys
      };
      setAirportList(updated);
      setEditIndex(null);
    } else {
      setAirportList([
        ...airportList,
        { ...formData, surveys: [] }
      ]);
    }

    setFormData({
      name: "",
      type: "",
      city: "",
      code: "",
      region: "",
      coordinates: ""
    });

    setShowForm(false); // 🔥 Close form after save
  };

  const deleteAirport = (index) => {
    const updated = airportList.filter((_, i) => i !== index);
    setAirportList(updated);
  };

  const editAirport = (index) => {
    setFormData(airportList[index]);
    setEditIndex(index);
    setShowForm(true); // 🔥 Open form in edit mode
  };

  const stopSurvey = (surveyIndex) => {
    const updated = [...airportList];
    updated[activeAirportIndex].surveys.splice(surveyIndex, 1);
    setAirportList(updated);
  };

  const stopAllSurveys = () => {
    const updated = [...airportList];
    updated[activeAirportIndex].surveys = [];
    setAirportList(updated);
  };

  return (
    <Layout>

      {/* 🔥 Header Row */}
      <div className="page-header">
        <h2>Airports</h2>

        <button
          className="add-airport-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditIndex(null);
            setFormData({
              name: "",
              type: "",
              city: "",
              code: "",
              region: "",
              coordinates: ""
            });
          }}
        >
          Add Airport
        </button>
      </div>

      {/* 🔥 FORM (Hidden by default) */}
      {showForm && (
        <div className="airport-form-container">

          <div className="airport-row">
            <input
              type="text"
              name="name"
              placeholder="Name of the Airport"
              value={formData.name}
              onChange={handleChange}
              className="airport-input large"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="airport-input medium"
            >
              <option value="">Domestic/International</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
          </div>

          <div className="airport-row">
            <input
              type="text"
              name="city"
              placeholder="Airport City"
              value={formData.city}
              onChange={handleChange}
              className="airport-input small"
            />

            <input
              type="text"
              name="code"
              placeholder="Airport Code"
              value={formData.code}
              onChange={handleChange}
              className="airport-input small"
            />

            <input
              type="text"
              name="region"
              placeholder="Airport Region"
              value={formData.region}
              onChange={handleChange}
              className="airport-input small"
            />
          </div>

          <div className="airport-button-row">
            <button className="map-btn">
              Select Airport on Map
            </button>

            <button
              className="add-airport-btn"
              onClick={handleSave}
            >
              {editIndex !== null ? "Update Airport" : "Save Airport"}
            </button>
          </div>

        </div>
      )}

      {/* ===== Table ===== */}
      <table className="airport-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Airport Name</th>
            <th>Type</th>
            <th>City</th>
            <th>Code</th>
            <th>Region</th>
            <th>Coordinates</th>
            <th>View Survey</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {airportList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.city}</td>
              <td>{item.code}</td>
              <td>{item.region}</td>
              <td>{item.coordinates}</td>

              <td>
                {item.surveys.length > 0 ? (
                  <button
                    className="view-btn"
                    onClick={() => setActiveAirportIndex(index)}
                  >
                    View Surveys
                  </button>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <button
                  className="edit-btn"
                  disabled={item.surveys.length > 0}
                  onClick={() => editAirport(index)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  disabled={item.surveys.length > 0}
                  onClick={() => deleteAirport(index)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Survey Modal Same As Before */}
      {activeAirportIndex !== null && (
        <div className="survey-modal">
          <div className="survey-modal-box">
            <h3>Running Surveys</h3>

            {airportList[activeAirportIndex].surveys.map((survey, i) => (
              <div key={i} className="survey-item">
                <span>{survey}</span>
                <button
                  className="stop-btn"
                  onClick={() => stopSurvey(i)}
                >
                  Stop
                </button>
              </div>
            ))}

            {airportList[activeAirportIndex].surveys.length > 0 && (
              <button
                className="stop-all-btn"
                onClick={stopAllSurveys}
              >
                Stop All
              </button>
            )}

            <button
              className="close-btn"
              onClick={() => setActiveAirportIndex(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default Airports;
