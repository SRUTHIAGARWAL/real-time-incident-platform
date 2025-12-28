import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL;
const socket = io(API);

export default function Feed() {
  const [incidents, setIncidents] = useState([]);

  const load = () =>
    axios.get(`${API}/api/incidents`)
      .then(res => setIncidents(res.data));

  useEffect(() => {
    load();
    socket.on("incident_updated", load);
  }, []);

  return (
    <div>
      <h1>Incident Feed</h1>
      {incidents.map(i => (
        <div key={i._id}>
          <h3>{i.type}</h3>
          <p>{i.description}</p>
          <p>Status: {i.status}</p>
          <button onClick={() =>
            axios.post(`${API}/api/incidents/${i._id}/upvote`)
          }>
            👍 {i.upvotes}
          </button>
        </div>
      ))}
    </div>
  );
}
