import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./pages/Feed";
import Report from "./pages/Report";
import Admin from "./pages/Admin";
import BottomNav from "./components/BottomNav";
import AppHeader from "./components/AppHeader";

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />

      <div style={{ paddingBottom: 80 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/report" element={<Report />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>

      <BottomNav />
    </BrowserRouter>
  );
}
