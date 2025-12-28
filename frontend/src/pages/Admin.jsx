import axios from "axios";
import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/incidents`)
      .then(res => setIncidents(res.data));
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      {incidents.map(i => (
        <button key={i._id} onClick={() =>
          axios.put(`${API}/api/incidents/${i._id}`, {
            verified: true,
            status: "in_progress"
          })
        }>
          Verify {i.type}
        </button>
      ))}
    </div>
  );
}
