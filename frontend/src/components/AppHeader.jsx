export default function AppHeader() {
  return (
    <header className="app-header">
      <span className="logo">🚨 ResQNow</span>

      <style>{`
        .app-header {
          padding: 14px;
          text-align: center;
          font-weight: 700;
          font-size: 18px;
          background: #ffffff;
          border-bottom: 1px solid #eee;
        }

        .logo {
          color: #d32f2f;
          letter-spacing: 0.5px;
        }
      `}</style>
    </header>
  );
}
