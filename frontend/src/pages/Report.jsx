import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function Report() {
  const submit = () => {
    navigator.geolocation.getCurrentPosition(async pos => {
      await axios.post(`${API}/api/incidents`, {
        type: "Accident",
        description: "User reported incident",
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      });
      alert("Incident reported");
    });
  };

  return <button onClick={submit}>Report Incident</button>;
}
