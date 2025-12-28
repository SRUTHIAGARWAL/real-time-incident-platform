export function getSeverity(type) {
  switch (type) {
    case "Fire":
    case "Medical":
      return { level: "High", color: "#d32f2f" };
    case "Accident":
    case "Flood":
    case "Crime":
      return { level: "Medium", color: "#f57c00" };
    default:
      return { level: "Low", color: "#388e3c" };
  }
}
