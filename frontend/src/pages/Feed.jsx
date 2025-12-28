import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getSeverity } from "../utils/severity";
import { getAddressFromCoords } from "../utils/geoCode";
const API = "https://incident-backend-q009.onrender.com";

const socket = io(API);

export default function Feed() {
  const [incidents, setIncidents] = useState([]);
  const [addresses, setAddresses] = useState({});

  const loadIncidents = async () => {
    const res = await axios.get(`${API}/api/incidents`);
    setIncidents(res.data);

    // Fetch readable address for each incident
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

  useEffect(() => {
    loadIncidents();
    socket.on("incident_updated", loadIncidents);
    return () => socket.off("incident_updated");
  }, []);

  const openMap = (lat, lng) => {
    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="feed-container">
      <h2 className="feed-title">Live Incident Feed</h2>

      {incidents.length === 0 && (
        <p className="empty">No incidents reported yet</p>
      )}

      {incidents.map((i) => {
        const severity = getSeverity(i.type);

        return (
          <div
            key={i._id}
            className="card"
            style={{ borderLeft: `6px solid ${severity.color}` }}
          >
            {/* HEADER */}
            <div className="header">
              <strong>{i.type}</strong>
              <span
                className="severity"
                style={{ background: severity.color }}
              >
                {severity.level}
              </span>
            </div>

            {/* IMAGE */}
            {i.media && (
              <img
                src={i.media}
                alt="incident"
                className="incident-image"
              />
            )}

            {/* DESCRIPTION */}
            {i.description && (
              <p className="description">{i.description}</p>
            )}

            {/* LOCATION */}
            <div className="location">
              📍 {addresses[i._id] || "Fetching location..."}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="actions">
              <button
                className="map-btn"
                onClick={() =>
                  openMap(i.location.lat, i.location.lng)
                }
              >
                🗺 Open Map
              </button>

              <button
                className="upvote-btn"
                onClick={() =>
                  axios.post(`${API}/api/incidents/${i._id}/upvote`)
                }
              >
                👍 {i.upvotes}
              </button>
            </div>
          </div>
        );
      })}

      {/* STYLES */}
      <style>{`
        .feed-container {
          max-width: 480px;
          margin: auto;
          padding: 16px;
          font-family: system-ui;
          padding-bottom: 90px;
        }

        .feed-title {
          text-align: center;
          margin-bottom: 16px;
        }

        .empty {
          text-align: center;
          color: #777;
        }

        .card {
          background: #fff;
          padding: 14px;
          border-radius: 16px;
          margin-bottom: 14px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
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


        .description {
          font-size: 14px;
          margin-bottom: 6px;
        }

        .location {
          font-size: 13px;
          color: #555;
          margin-bottom: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .map-btn {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          border: none;
          background: #e3f2fd;
          cursor: pointer;
          font-size: 13px;
        }

        .upvote-btn {
          padding: 8px 12px;
          border-radius: 20px;
          border: none;
          background: #eeeeee;
          cursor: pointer;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
