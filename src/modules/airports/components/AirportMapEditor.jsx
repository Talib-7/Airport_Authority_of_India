import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polygon, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MAX_AREA_KM2 = 500;
const INDIA_CENTER = [20.5937, 78.9629];

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const toLatLngPosition = (point) => {
  if (!point?.coordinates?.length) {
    return null;
  }

  return [point.coordinates[1], point.coordinates[0]];
};

const toVertexList = (polygon) => {
  const ring = polygon?.coordinates?.[0];

  if (!ring?.length) {
    return [];
  }

  return ring.slice(0, -1).map(([longitude, latitude]) => ({
    latitude,
    longitude,
  }));
};

const toLatLngList = (vertices) => vertices.map((vertex) => [vertex.latitude, vertex.longitude]);

const toPolygonGeometry = (vertices) => {
  if (vertices.length < 3) {
    return null;
  }

  const ring = vertices.map((vertex) => [vertex.longitude, vertex.latitude]);
  ring.push([vertices[0].longitude, vertices[0].latitude]);

  return {
    type: 'Polygon',
    coordinates: [ring],
  };
};

const calculateCentroid = (vertices) => {
  if (!vertices.length) {
    return null;
  }

  const totals = vertices.reduce(
    (accumulator, vertex) => ({
      latitude: accumulator.latitude + vertex.latitude,
      longitude: accumulator.longitude + vertex.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );

  return {
    latitude: totals.latitude / vertices.length,
    longitude: totals.longitude / vertices.length,
  };
};

const calculateAreaKm2 = (vertices) => {
  if (vertices.length < 3) {
    return 0;
  }

  const latLngs = toLatLngList(vertices).map(([latitude, longitude]) => L.latLng(latitude, longitude));

  if (L.GeometryUtil?.geodesicArea) {
    return L.GeometryUtil.geodesicArea(latLngs) / 1000000;
  }

  return 0;
};

const AirportMapEditor = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [center, setCenter] = useState(() => toLatLngPosition(value.location) || INDIA_CENTER);
  const [vertices, setVertices] = useState(() => toVertexList(value.serviceArea));
  const [isClosed, setIsClosed] = useState(() => Boolean(value.serviceArea?.coordinates?.[0]?.length >= 4));
  const [feedback, setFeedback] = useState('');

  const pointPosition = useMemo(() => toLatLngPosition(value.location), [value.location]);
  const areaKm2 = useMemo(() => calculateAreaKm2(vertices), [vertices]);
  const areaLabel = areaKm2 > 0 ? `${areaKm2.toFixed(2)} km²` : '0.00 km²';
  const remainingLabel = `${Math.max(0, MAX_AREA_KM2 - areaKm2).toFixed(2)} km² remaining`;
  const polygonPositions = useMemo(() => (isClosed ? toLatLngList(vertices) : null), [isClosed, vertices]);

  useEffect(() => {
    if (pointPosition) {
      setCenter(pointPosition);
    }
  }, [pointPosition]);

  useEffect(() => {
    if (vertices.length >= 3 && areaKm2 > MAX_AREA_KM2) {
      setFeedback(`Selected area exceeds the ${MAX_AREA_KM2} km² limit.`);
      return;
    }

    if (vertices.length >= 3 && !isClosed) {
      setFeedback('Close the shape when you are ready to save it.');
      return;
    }

    setFeedback('');
  }, [areaKm2, isClosed, vertices.length]);

  const syncSelection = (nextVertices, closed = false) => {
    const nextArea = calculateAreaKm2(nextVertices);
    const nextPolygon = closed ? toPolygonGeometry(nextVertices) : null;
    const nextCentroid = calculateCentroid(nextVertices);

    setVertices(nextVertices);
    setIsClosed(closed);

    onChange({
      ...value,
      location:
        nextCentroid && nextVertices.length >= 1
          ? {
              type: 'Point',
              coordinates: [nextCentroid.longitude, nextCentroid.latitude],
            }
          : null,
      serviceArea: nextPolygon,
    });

    if (nextVertices.length >= 3 && nextArea > MAX_AREA_KM2) {
      setFeedback(`Selected area exceeds the ${MAX_AREA_KM2} km² limit.`);
      return;
    }

    if (nextVertices.length >= 3 && !closed) {
      setFeedback('Close the shape when you are ready to save it.');
      return;
    }

    setFeedback('');
  };

  const handleMapClick = (latitude, longitude) => {
    if (isClosed) {
      setFeedback('Open the shape again or clear it before adding more points.');
      return;
    }

    const nextVertices = [...vertices, { latitude, longitude }];
    syncSelection(nextVertices, false);
  };

  const handleCloseShape = () => {
    if (vertices.length < 3) {
      const pointLabel = vertices.length === 2 ? 'Only 2 points selected. You cannot close the shape yet.' : 'Add at least 3 points before closing the shape.';
      setFeedback(pointLabel);
      toast.warning(pointLabel);
      return;
    }

    const nextArea = calculateAreaKm2(vertices);

    if (nextArea > MAX_AREA_KM2) {
      const message = `Selected area exceeds the ${MAX_AREA_KM2} km² limit.`;
      setFeedback(message);
      toast.error(message);
      return;
    }

    syncSelection(vertices, true);
    setFeedback('Shape closed and ready to save.');
  };

  const handleUndoPoint = () => {
    if (!vertices.length) {
      return;
    }

    const nextVertices = vertices.slice(0, -1);
    syncSelection(nextVertices, false);
  };

  const handleClear = () => {
    setVertices([]);
    setIsClosed(false);
    setFeedback('');
    onChange({
      ...value,
      location: null,
      serviceArea: null,
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        },
      );

      const results = await response.json();
      const firstResult = results[0];

      if (!firstResult) {
        return;
      }

      setCenter([Number(firstResult.lat), Number(firstResult.lon)]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="airport-map-editor">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        className="airport-map-toast-container"
      />

      <div className="airport-map-toolbar">
        <div className="airport-map-search">
          <input
            type="text"
            placeholder="Search city, terminal, or landmark"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch();
              }
            }}
          />
          <button type="button" onClick={handleSearch} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="airport-map-hint">
          Click to place points around the airport region. Close the shape when finished.
        </div>
      </div>

      <MapContainer center={center} zoom={8} scrollWheelZoom className="airport-leaflet-map">
        <MapController center={center} onPointSelect={handleMapClick} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polygonPositions ? (
          <Polygon
            positions={polygonPositions}
            pathOptions={{ color: '#1e88e5', weight: 3, fillOpacity: 0.18 }}
          />
        ) : vertices.length > 1 ? (
          <Polyline
            positions={toLatLngList(vertices)}
            pathOptions={{ color: '#0b1853', weight: 3, dashArray: '8 8' }}
          />
        ) : null}

        {vertices.map((vertex, index) => (
          <Marker key={`${vertex.latitude}-${vertex.longitude}-${index}`} position={[vertex.latitude, vertex.longitude]} />
        ))}

        {isClosed && pointPosition ? <Marker position={pointPosition} /> : null}
      </MapContainer>

      <div className="airport-map-actions">
        <button type="button" className="secondary-action-btn" onClick={handleUndoPoint} disabled={!vertices.length}>
          Undo point
        </button>
        <button type="button" className="secondary-action-btn" onClick={handleClear} disabled={!vertices.length && !value.location && !value.serviceArea}>
          Clear all
        </button>
        <button
          type="button"
          className="primary-action-btn"
          onClick={handleCloseShape}
          disabled={vertices.length < 3}
        >
          Close shape
        </button>
      </div>

      <div className="airport-map-summary">
        <div>
          <span>Selected area</span>
          <strong className={areaKm2 > MAX_AREA_KM2 ? 'airport-area-warning' : ''}>
            {areaLabel} / {MAX_AREA_KM2} km²
          </strong>
        </div>
        <div>
          <span>Points selected</span>
          <strong>{vertices.length}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{isClosed ? 'Shape closed' : 'Selecting points'}</strong>
        </div>
      </div>

      {feedback ? <div className="airport-map-feedback">{feedback}</div> : null}
    </div>
  );
};

const MapController = ({ center, onPointSelect }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 11), {
      animate: true,
      duration: 0.7,
    });
  }, [center, map]);

  useMapEvents({
    click(event) {
      onPointSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

export default AirportMapEditor;