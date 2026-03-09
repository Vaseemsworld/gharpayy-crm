import { useState } from "react";
import { SOURCES } from "../constants";
import { todayStr } from "../data/seedData";
import { SourceBadge } from "../components/ui/Badge";

const SOURCE_EMOJI = {
  Website: "🌐",
  WhatsApp: "💬",
  Phone: "📞",
  "Social Media": "📱",
  "Google Form": "📋",
  "Tally Form": "📊",
};

const NewLead = ({ onSubmit, agents, rrIdx }) => {
  const [form, setForm] = useState({ name: "", phone: "", source: "Website" });
  const [done, setDone] = useState(null);

  const nextAgent = agents[rrIdx % agents.length];

  const isValid = form.name.trim() && form.phone.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    const result = onSubmit(form);
    setDone(result);
    setForm({ name: "", phone: "", source: "Website" });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 24,
            color: "#0F172A",
            fontWeight: 800,
          }}
        >
          New Lead Capture
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
          Automatically assigned via Round Robin · Instant CRM entry
        </p>
      </div>

      {/* Success banner */}
      {done && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #86EFAC",
            borderRadius: 14,
            padding: 20,
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 28 }}>✅</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#166534" }}>
              Lead Created Successfully!
            </div>
            <div style={{ fontSize: 12, color: "#16A34A", marginTop: 4 }}>
              <strong>{done.name}</strong> ({done.id}) → assigned to{" "}
              <strong>
                {agents.find((a) => a.id === done.assignedAgent)?.name}
              </strong>{" "}
              · Stage: New Lead
            </div>
          </div>
          <button
            onClick={() => setDone(null)}
            style={{
              marginLeft: "auto",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#4ADE80",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* ── Form ── */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: 24,
            }}
          >
            Lead Submission Form
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Name */}
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 7,
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ravi Kumar"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 14,
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 7,
                }}
              >
                Phone Number *
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 14,
                }}
              />
            </div>

            {/* Source */}
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 7,
                }}
              >
                Lead Source
              </label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 14,
                  background: "white",
                  color: "#374151",
                }}
              >
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Auto-generated preview */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: 12,
                padding: 16,
                border: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 10,
                }}
              >
                Auto-Generated Fields
              </div>
              {[
                ["📅 Timestamp",  new Date().toLocaleString("en-IN")],
                ["🔄 Assignment", `Round Robin → ${nextAgent?.name}`],
                ["📊 Stage",      "New Lead"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}
                >
                  {label}:{" "}
                  <strong style={{ color: "#0F172A" }}>{val}</strong>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              style={{
                padding: 14,
                borderRadius: 12,
                background: isValid
                  ? "linear-gradient(135deg,#FF6B35,#FF8C5A)"
                  : "#E2E8F0",
                color: isValid ? "white" : "#94A3B8",
                border: "none",
                cursor: isValid ? "pointer" : "not-allowed",
                fontSize: 15,
                fontWeight: 700,
                boxShadow: isValid ? "0 4px 14px rgba(255,107,53,0.35)" : "none",
                transition: "all 0.2s",
              }}
            >
              Submit Lead →
            </button>
          </div>
        </div>

        {/* ── Info panels ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Sources */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: 14,
              }}
            >
              📡 Supported Lead Sources
            </h3>
            {SOURCES.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  background: "#F8FAFC",
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 15 }}>{SOURCE_EMOJI[s]}</span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {s}
                </span>
                <SourceBadge source={s} />
              </div>
            ))}
          </div>

          {/* Round Robin info */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: 12,
              }}
            >
              🔄 Round Robin Assignment
            </h3>
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                lineHeight: 1.7,
                marginBottom: 12,
              }}
            >
              Leads are auto-distributed equally across agents to prevent overlap
              and ensure fair workload.
            </p>
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: 10,
                padding: 14,
                border: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Assignment Queue Example
              </div>
              {[
                "L001 → Priya Sharma",
                "L002 → Rahul Verma",
                "L003 → Sneha Patel",
                "L004 → Priya Sharma (repeat)",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 11,
                    color: "#374151",
                    padding: "4px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  {t}
                </div>
              ))}
              <div
                style={{
                  fontSize: 11,
                  color: "#6366F1",
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Next: <strong>{nextAgent?.name}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLead;
