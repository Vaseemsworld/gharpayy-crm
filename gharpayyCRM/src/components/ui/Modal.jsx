const Modal = ({ onClose, title, width = 480, children }) => (
  <div
    onClick={(e) => e.target === e.currentTarget && onClose()}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.45)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 28,
        width,
        maxWidth: "92vw",
        maxHeight: "88vh",
        overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <h2
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#F1F5F9",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
