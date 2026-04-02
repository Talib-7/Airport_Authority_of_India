import { useEffect, useMemo, useState } from 'react';
import Layout from '../layout/Layout';
import AirportMapEditor from './components/AirportMapEditor';
import airportsService from './services/airportsService';
import './airports.css';

const initialFormState = {
  airportName: '',
  airportCode: '',
  airportType: 'DOMESTIC',
  airportCity: '',
  airportRegion: '',
  location: null,
  serviceArea: null,
  status: true,
};

const normalizeGeometry = (geometry) => {
  if (!geometry) {
    return null;
  }

  if (typeof geometry === 'string') {
    return JSON.parse(geometry);
  }

  return geometry;
};

const normalizeAirport = (airport) => ({
  ...airport,
  location: normalizeGeometry(airport.location),
  serviceArea: normalizeGeometry(airport.serviceArea),
});

const Airports = () => {
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [editingAirportId, setEditingAirportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  const loadAirports = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await airportsService.findAll();
      const airportList = Array.isArray(response) ? response.map(normalizeAirport) : [];
      setAirports(airportList);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load airports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAirports();
  }, []);

  const filteredAirports = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return airports;
    }

    return airports.filter((airport) => {
      return [airport.airportName, airport.airportCode, airport.airportCity, airport.airportRegion]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [airports, searchText]);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingAirportId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (airport) => {
    setEditingAirportId(airport.airportId);
    setFormData({
      airportName: airport.airportName,
      airportCode: airport.airportCode,
      airportType: airport.airportType,
      airportCity: airport.airportCity,
      airportRegion: airport.airportRegion,
      location: airport.location,
      serviceArea: airport.serviceArea,
      status: airport.status,
    });
    setShowForm(true);
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMapChange = (nextValue) => {
    setFormData((current) => ({
      ...current,
      ...nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.location || !formData.serviceArea) {
      setError('Select a coordinate and draw the airport service area before saving.');
      setSaving(false);
      return;
    }

    const payload = {
      airportName: formData.airportName.trim(),
      airportCode: formData.airportCode.trim().toUpperCase(),
      airportType: formData.airportType,
      airportCity: formData.airportCity.trim(),
      airportRegion: formData.airportRegion.trim(),
      location: formData.location,
      serviceArea: formData.serviceArea,
      status: formData.status,
    };

    try {
      if (editingAirportId) {
        await airportsService.update(editingAirportId, payload);
      } else {
        await airportsService.create(payload);
      }

      await loadAirports();
      setShowForm(false);
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save airport');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (airportId) => {
    const confirmed = window.confirm('Delete this airport and its service region?');

    if (!confirmed) {
      return;
    }

    try {
      await airportsService.remove(airportId);
      await loadAirports();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete airport');
    }
  };

  return (
    <Layout>
      <div className={`airports-page ${showForm ? 'form-open' : ''}`}>
        <div className="page-header airport-page-header">
          <div>
            <h2>Airport Management</h2>
      
          </div>

          <div className="airport-header-actions">
            <input
              className="airport-search-input"
              type="text"
              placeholder="Search by name, code, city, or region"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <button
              className="add-airport-btn"
              onClick={showForm ? () => setShowForm(false) : openCreateForm}
            >
              {showForm ? 'Close Form' : 'Add Airport'}
            </button>
          </div>
        </div>

        {error ? <div className="airport-alert airport-alert-error">{error}</div> : null}

        {showForm ? (
          <form className="airport-form-shell" onSubmit={handleSubmit}>
            <div className="airport-form-grid">
              <div className="airport-panel airport-form-panel">
                <h3>{editingAirportId ? 'Edit Airport' : 'New Airport'}</h3>

                <div className="airport-field-grid">
                  <label>
                    Airport name
                    <input name="airportName" value={formData.airportName} onChange={handleFieldChange} placeholder="Indira Gandhi International Airport" />
                  </label>

                  <label>
                    Airport code
                    <input name="airportCode" value={formData.airportCode} onChange={handleFieldChange} placeholder="DEL" maxLength={10} />
                  </label>

                  <label>
                    Airport type
                    <select name="airportType" value={formData.airportType} onChange={handleFieldChange}>
                      <option value="DOMESTIC">Domestic</option>
                      <option value="INTERNATIONAL">International</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </label>

                  <label>
                    City
                    <input name="airportCity" value={formData.airportCity} onChange={handleFieldChange} placeholder="Delhi" />
                  </label>

                  <label>
                    Region label
                    <input name="airportRegion" value={formData.airportRegion} onChange={handleFieldChange} placeholder="North India" />
                  </label>

                  <label className="airport-status-field">
                    <input name="status" type="checkbox" checked={formData.status} onChange={handleFieldChange} />
                    Active airport
                  </label>
                </div>

                <div className="airport-form-footer">
                  {formData.serviceArea ? (
                    <div>
                      <span>Selected coordinate</span>
                      <strong>
                        {`${formData.location.coordinates[1].toFixed(5)}, ${formData.location.coordinates[0].toFixed(5)}`}
                      </strong>
                    </div>
                  ) : null}
                  <div>
                    <span>Service area</span>
                    <strong>{formData.serviceArea ? 'Defined' : 'Not drawn yet'}</strong>
                  </div>
                </div>

                <div className="airport-form-actions">
                  <button type="button" className="secondary-action-btn" onClick={() => setFormData((current) => ({ ...current, serviceArea: null }))}>
                    Clear region
                  </button>
                  <button type="button" className="secondary-action-btn" onClick={() => setFormData((current) => ({ ...current, location: null }))}>
                    Clear coordinate
                  </button>
                  <button type="submit" className="primary-action-btn" disabled={saving}>
                    {saving ? 'Saving...' : editingAirportId ? 'Update airport' : 'Save airport'}
                  </button>
                </div>
              </div>

              <div className="airport-panel airport-map-panel">
                <AirportMapEditor value={formData} onChange={handleMapChange} />
              </div>
            </div>
          </form>
        ) : null}

        {!showForm ? (
        <div className="airport-table-shell">
          {loading ? (
            <div className="airport-empty-state">Loading airports...</div>
          ) : filteredAirports.length === 0 ? (
            <div className="airport-empty-state">No airports found.</div>
          ) : (
            <table className="airport-table">
              <thead>
                <tr>
                  <th>Airport</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Region</th>
                  <th>Coordinate</th>
                  <th>Service Area</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAirports.map((airport) => {
                  const point = airport.location?.coordinates;
                  const polygon = airport.serviceArea?.coordinates?.[0] || [];

                  return (
                    <tr key={airport.airportId}>
                      <td>
                        <strong>{airport.airportName}</strong>
                      </td>
                      <td>{airport.airportCode}</td>
                      <td>{airport.airportType}</td>
                      <td>{airport.airportCity}</td>
                      <td>{airport.airportRegion}</td>
                      <td>{point ? `${point[1].toFixed(5)}, ${point[0].toFixed(5)}` : '-'}</td>
                      <td>{polygon.length ? `${polygon.length} vertices` : '-'}</td>
                      <td>
                        <span className={airport.status ? 'airport-status-pill active' : 'airport-status-pill inactive'}>
                          {airport.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="table-action-btn edit" onClick={() => openEditForm(airport)}>
                          Edit
                        </button>
                        <button className="table-action-btn delete" onClick={() => handleDelete(airport.airportId)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Airports;