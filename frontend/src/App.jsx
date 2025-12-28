import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import Report from "./pages/Report";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10 }}>
        <Link to="/">Feed</Link> |{" "}
        <Link to="/report">Report</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/report" element={<Report />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
