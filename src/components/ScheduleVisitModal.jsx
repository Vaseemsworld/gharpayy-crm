import { useState } from "react";
import Modal from "./ui/Modal";
import { PROPERTIES } from "../constants";
import { todayStr } from "../data/seedData";

const ScheduleVisitModal = ({ lead, onClose, onSchedule }) => {
  const [form, setForm] = useState({
    property: PROPERTIES[0],
    date: todayStr,
    time: "11:00",
    notes: "",
  });

  return (
    <Modal onClose={onClose} title="Schedule Property Visit">
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>
        For: <strong style={{ color: "#0F172A" }}>{lead?.name}</strong>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Property */}
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Property *
          </label>
          <select
            value={form.property}
            onChange={(e) => setForm({ ...form, property: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1.5px solid #E2E8F0",
              fontSize: 13,
              background: "white",
            }}
          >
            {PROPERTIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              Visit Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1.5px solid #E2E8F0",
                fontSize: 13,
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              Time *
            </label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1.5px solid #E2E8F0",
                fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Notes
          </label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="e.g. Meet at reception…"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1.5px solid #E2E8F0",
              fontSize: 13,
              resize: "vertical",
            }}
          />
        </div>

        <button
          onClick={() => onSchedule(form)}
          style={{
            padding: 13,
            borderRadius: 11,
            background: "linear-gradient(135deg,#FF6B35,#FF8C5A)",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(255,107,53,0.35)",
          }}
        >
          Confirm Visit →
        </button>
      </div>
    </Modal>
  );
};

export default ScheduleVisitModal;
