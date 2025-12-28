import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const INCIDENT_TYPES = [
  { label: "Fire", icon: "🔥", color: "#e53935" },
  { label: "Accident", icon: "🚗", color: "#fb8c00" },
  { label: "Medical", icon: "🚑", color: "#43a047" },
  { label: "Crime", icon: "🚓", color: "#1e88e5" },
  { label: "Flood", icon: "🌊", color: "#039be5" },
  { label: "Other", icon: "⚠️", color: "#757575" },
];

// ✅ MUST BE ABOVE submitIncident
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function Report() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => alert("Location permission is required")
    );
  };

  const submitIncident = async () => {
    if (!type || !location) return;

    setLoading(true);

    let imageBase64 = null;
    if (photo) {
      imageBase64 = await toBase64(photo);
    }

    await axios.post(`${API}/api/incidents`, {
      type,
      description,
      location,
      media: imageBase64,
    });

    setLoading(false);
    alert("Incident reported successfully");

    setType("");
    setDescription("");
    setPhoto(null);
    setLocation(null);
  };

  return (
    <div className="container">
      <h2 className="title">Report an Incident</h2>

      <p className="label">What’s happening?</p>
      <div className="type-grid">
        {INCIDENT_TYPES.map((i) => (
          <button
            key={i.label}
            className={`type-btn ${type === i.label ? "active" : ""}`}
            style={{
              borderColor: type === i.label ? i.color : "#ddd",
            }}
            onClick={() => setType(i.label)}
          >
            <span className="icon">{i.icon}</span>
            <span>{i.label}</span>
          </button>
        ))}
      </div>

      <p className="label">Description (optional)</p>
      <textarea
        className="textarea"
        placeholder="Add more details if needed..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <p className="label">Add Photo (optional)</p>
      <label className="media-btn">
        📷 Take / Upload Photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </label>
      {photo && <p className="hint">Photo selected ✓</p>}

      <button className="location-btn" onClick={getLocation}>
        {location ? "📍 Location Captured" : "Use Current Location"}
      </button>

      <button
        className="submit-btn"
        disabled={!type || !location || loading}
        onClick={submitIncident}
      >
        {loading ? "Submitting..." : "Send Report"}
      </button>

      <style>{`
        .container {
          max-width: 420px;
          margin: auto;
          padding: 16px;
          font-family: system-ui;
        }
        .title {
          text-align: center;
          margin-bottom: 16px;
        }
        .label {
          font-weight: 600;
          margin: 14px 0 8px;
        }
        .type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .type-btn {
          padding: 14px 8px;
          border-radius: 14px;
          border: 2px solid #ddd;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .icon {
          font-size: 26px;
        }
        .textarea {
          width: 100%;
          height: 80px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }
        .media-btn {
          display: block;
          padding: 12px;
          border-radius: 10px;
          background: #f3f3f3;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #bbb;
        }
        .hint {
          font-size: 12px;
          color: green;
          margin-top: 4px;
        }
        .location-btn {
          width: 100%;
          margin-top: 14px;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #e0e0e0;
        }
        .submit-btn {
          width: 100%;
          margin-top: 18px;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: #d32f2f;
          color: white;
          font-size: 16px;
          font-weight: 600;
        }
        .submit-btn:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
