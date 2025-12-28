import { useEffect, useState } from "react";
import axios from "axios";
import { getSeverity } from "../utils/severity";
import { getAddressFromCoords } from "../utils/geoCode";
import AdminLogin from "./AdminLogin";

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const token = localStorage.getItem("adminToken");

  const [incidents, setIncidents] = useState([]);
  const [addresses, setAddresses] = useState({});

  // BLOCK DASHBOARD IF NOT LOGGED IN
  if (!token) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  const loadIncidents = async () => {
    const res = await axios.get(`${API}/api/incidents`);
    setIncidents(res.data);

    res.data.forEach(async (i) => {
      if (!addresses[i._id]) {
        const addr = await getAddressFromCoords(
          i.location.lat,
          i.location.lng
        );
        setAddresses((prev) => ({ ...prev, [i._id]: addr }));
      }
    });
  };

  const updateIncident = async (id, data) => {
    await axios.put(
      `${API}/api/incidents/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    loadIncidents();
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">🚨 Responder Dashboard</h2>

      {incidents.map((i) => {
        const severity = getSeverity(i.type);

        return (
          <div
            key={i._id}
            className="admin-card"
            style={{ borderLeft: `6px solid ${severity.color}` }}
          >
            <div className="header">
              <strong>{i.type}</strong>
              <span
                className="severity"
                style={{ background: severity.color }}
              >
                {severity.level}
              </span>
            </div>

            {i.media && (
              <img src={i.media} className="incident-image" />
            )}

            {i.description && <p>{i.description}</p>}

            <p className="location">
              📍 {addresses[i._id] || "Fetching location..."}
            </p>

            <div className="meta">
              <span>🕒 {new Date(i.createdAt).toLocaleString()}</span>
              <span>👍 {i.upvotes}</span>
              {i.verified && <span className="verified">✔ Verified</span>}
            </div>

            <button
              className="map-btn"
              onClick={() =>
                openMap(i.location.lat, i.location.lng)
              }
            >
              🗺 Open in Maps
            </button>

            <div className="actions">
              {!i.verified && (
                <button
                  className="verify"
                  onClick={() =>
                    updateIncident(i._id, {
                      verified: true,
                      status: "in_progress",
                    })
                  }
                >
                  Verify
                </button>
              )}

              {i.status !== "resolved" && (
                <button
                  className="resolve"
                  onClick={() =>
                    updateIncident(i._id, { status: "resolved" })
                  }
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        .admin-container {
          max-width: 520px;
          margin: auto;
          padding: 16px;
          font-family: system-ui;
          padding-bottom: 90px;
        }

        .admin-title {
          text-align: center;
          margin-bottom: 16px;
        }

        .admin-card {
          background: #fff;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
        }

        .severity {
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
        }

        .incident-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin: 8px 0;
  background: #f5f5f5;
}

        .location {
          font-size: 13px;
          color: #555;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .verified {
          color: green;
          font-weight: 600;
        }

        .map-btn {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: #e3f2fd;
          margin-bottom: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .verify {
          flex: 1;
          background: #1976d2;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 10px;
        }

        .resolve {
          flex: 1;
          background: #388e3c;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
