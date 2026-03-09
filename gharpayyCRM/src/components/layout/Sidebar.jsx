import { NAV } from "../../constants";

const Sidebar = ({ page, setPage }) => (
  <div
    style={{
      width: 228,
      minHeight: "100vh",
      background: "#161D35",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 200,
      boxShadow: "4px 0 20px rgba(0,0,0,0.18)",
    }}
  >
    {/* Brand */}
    <div
      style={{
        padding: "22px 18px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: "linear-gradient(135deg,#FF6B35,#FF8C5A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 4px 14px rgba(255,107,53,0.45)",
          }}
        >
          🏘️
        </div>
        <div>
          <div
            style={{
              color: "white",
              fontFamily: "Sora, sans-serif",
              fontSize: 16,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            Gharpayy
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            CRM · BANGALORE
          </div>
        </div>
      </div>
    </div>

    {/* Nav links */}
    <nav style={{ padding: "10px 10px", flex: 1 }}>
      {NAV.map((n) => (
        <button
          key={n.id}
          onClick={() => setPage(n.id)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "9px 12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: page === n.id ? "rgba(255,107,53,0.15)" : "transparent",
            color: page === n.id ? "#FF6B35" : "rgba(255,255,255,0.5)",
            fontSize: 13,
            fontWeight: page === n.id ? 700 : 500,
            marginBottom: 2,
            textAlign: "left",
            borderLeft: page === n.id ? "3px solid #FF6B35" : "3px solid transparent",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 14 }}>{n.icon}</span>
          {n.label}
        </button>
      ))}
    </nav>

    {/* Admin user */}
    <div
      style={{
        padding: 14,
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FF6B35,#FF8C5A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          AD
        </div>
        <div>
          <div style={{ color: "white", fontSize: 12, fontWeight: 700 }}>
            Admin User
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
            admin@gharpayy.com
          </div>
        </div>
        <span
          style={{
            marginLeft: "auto",
            background: "rgba(16,185,129,0.2)",
            color: "#10B981",
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 20,
          }}
        >
          ADMIN
        </span>
      </div>
    </div>
  </div>
);

export default Sidebar;
