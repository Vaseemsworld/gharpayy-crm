const Stat = ({ label, value, icon, color, sub }) => (
  <div
    style={{
      background: "white",
      borderRadius: 16,
      padding: "20px 22px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.04)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        right: 16,
        top: 16,
        width: 44,
        height: 44,
        borderRadius: 12,
        background: color + "18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        color: "#64748B",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: "Sora, sans-serif",
        fontSize: 32,
        fontWeight: 800,
        color: "#0F172A",
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ color, fontSize: 11, fontWeight: 600, marginTop: 6 }}>
        {sub}
      </div>
    )}
  </div>
);

export default Stat;
