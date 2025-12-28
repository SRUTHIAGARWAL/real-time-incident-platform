import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  const Item = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`nav-item ${pathname === to ? "active" : ""}`}
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </Link>
  );

  return (
    <>
      <nav className="bottom-nav">
        <Item to="/" icon="📋" label="Feed" />

        {/* CENTER ACTION */}
        <Link to="/report" className="nav-center">
          <div className="nav-center-btn">
            🚨
          </div>
          <span className="center-label">Report</span>
        </Link>

        <Item to="/admin" icon="🛡️" label="Admin" />

      </nav>

      {/* STYLES */}
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #ffffff;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
        }

        .nav-item {
          flex: 1;
          text-align: center;
          text-decoration: none;
          color: #777;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .nav-item .icon {
          font-size: 20px;
        }

        .nav-item.active {
          color: #d32f2f;
          font-weight: 600;
        }

        .nav-center {
          position: relative;
          top: -20px;
          text-align: center;
          text-decoration: none;
        }

        .nav-center-btn {
          width: 56px;
          height: 56px;
          background: #d32f2f;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          margin: auto;
        }

        .center-label {
          font-size: 12px;
          color: #d32f2f;
          margin-top: 4px;
          display: block;
        }

        @media (min-width: 768px) {
          .bottom-nav {
            max-width: 480px;
            margin: auto;
            left: 0;
            right: 0;
          }
        }
      `}</style>
    </>
  );
}
