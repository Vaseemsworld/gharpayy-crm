import { useState } from "react";
import { STAGES, STAGE_COLORS, VISIT_OUTCOMES, ACT_ICON, ACT_CLR } from "../constants";
import { fmtDT, needsFollowUp, since } from "../utils/helpers";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import ScheduleVisitModal from "../components/ScheduleVisitModal";
import { StageBadge, SourceBadge, VisitBadge, FUBadge } from "../components/ui/Badge";

const LeadDetail = ({
  lead,
  agents,
  activities,
  visits,
  onBack,
  onMove,
  onNote,
  onSchedule,
  onReassign,
  onVisitOutcome,
}) => {
  const [noteText,     setNoteText]     = useState("");
  const [showMove,     setShowMove]     = useState(false);
  const [showVisit,    setShowVisit]    = useState(false);
  const [showReassign, setShowReassign] = useState(false);

  const ag   = agents.find((a) => a.id === lead.assignedAgent);
  const acts = activities
    .filter((a) => a.leadId === lead.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const lvs  = visits.filter((v) => v.leadId === lead.id);
  const fu   = needsFollowUp(lead);

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6366F1",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        ← Back to Leads
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Lead header card */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 16,
                    background: "#EEF2FF",
                    color: "#4338CA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#0F172A",
                    }}
                  >
                    {lead.name}
                  </div>
                  <div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>
                    {lead.phone} ·{" "}
                    <span style={{ color: "#CBD5E1" }}>{lead.id}</span>
                  </div>
                  {fu && (
                    <div style={{ marginTop: 5 }}>
                      <FUBadge />
                    </div>
                  )}
                </div>
              </div>
              <StageBadge stage={lead.stage} />
            </div>

            {/* Info grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
                marginBottom: 20,
              }}
            >
              {[
                ["Source",        <SourceBadge source={lead.source} />],
                ["Assigned To",   <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar agent={ag} size={20} /><span style={{ fontSize: 12, fontWeight: 600 }}>{ag?.name}</span></div>],
                ["Created",       <span style={{ fontSize: 12, color: "#374151" }}>{fmtDT(lead.createdAt)}</span>],
                ["Last Activity", <span style={{ fontSize: 12, color: "#374151" }}>{since(lead.lastActivityAt)}</span>],
                ["Stage",         <StageBadge stage={lead.stage} />],
                ["Visits",        <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{lvs.length}</span>],
              ].map(([label, val]) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#94A3B8",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 5,
                    }}
                  >
                    {label}
                  </div>
                  {val}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              {[
                ["Move Stage",      "#EEF2FF", "#4338CA", () => setShowMove(true)],
                ["+ Schedule Visit","#FFF7ED", "#C2410C", () => setShowVisit(true)],
                ["Reassign Lead",   "#F0FDF4", "#166534", () => setShowReassign(true)],
              ].map(([label, bg, color, fn]) => (
                <button
                  key={label}
                  onClick={fn}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 10,
                    background: bg,
                    color,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
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
              Notes
            </h3>
            {lead.notes && (
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 13,
                  color: "#78350F",
                  marginBottom: 14,
                  lineHeight: 1.6,
                }}
              >
                {lead.notes}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note…"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 13,
                  resize: "none",
                }}
              />
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    onNote(lead.id, noteText);
                    setNoteText("");
                  }
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#6366F1,#818CF8)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  alignSelf: "flex-end",
                }}
              >
                Save
              </button>
            </div>
          </div>

          {/* Visit history */}
          {lvs.length > 0 && (
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
                Visit History
              </h3>
              {lvs.map((v) => (
                <div
                  key={v.id}
                  style={{
                    padding: 14,
                    background: "#F8FAFC",
                    borderRadius: 10,
                    marginBottom: 10,
                    border: "1px solid #F1F5F9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}
                    >
                      {v.property}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>
                      📅 {v.date} · ⏰ {v.time}
                    </div>
                    {v.notes && (
                      <div
                        style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}
                      >
                        {v.notes}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 7,
                    }}
                  >
                    <VisitBadge status={v.status} />
                    {v.status === "Scheduled" && (
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) onVisitOutcome(v.id, e.target.value);
                        }}
                        style={{
                          fontSize: 10,
                          padding: "3px 7px",
                          borderRadius: 7,
                          border: "1px solid #E2E8F0",
                          color: "#374151",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>
                          Update outcome
                        </option>
                        {VISIT_OUTCOMES.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Activity Timeline ── */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.04)",
            position: "sticky",
            top: 20,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: 20,
            }}
          >
            Activity Timeline
          </h3>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 13,
                top: 0,
                bottom: 0,
                width: 2,
                background: "#F1F5F9",
              }}
            />
            {acts.map((act) => {
              const c = ACT_CLR[act.type] || "#6B7280";
              return (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: 16,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: `${c}18`,
                      border: `2px solid ${c}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                      fontSize: 11,
                    }}
                  >
                    {ACT_ICON[act.type] || "·"}
                  </div>
                  <div style={{ paddingTop: 3 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#0F172A",
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {act.desc}
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                      {fmtDT(act.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            {acts.length === 0 && (
              <div
                style={{
                  fontSize: 12,
                  color: "#94A3B8",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                No activities yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {showMove && (
        <Modal onClose={() => setShowMove(false)} title="Move Stage">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onMove(lead.id, s);
                  setShowMove(false);
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  border: `1.5px solid ${STAGE_COLORS[s]}50`,
                  background: `${STAGE_COLORS[s]}${lead.stage === s ? "30" : "10"}`,
                  color: STAGE_COLORS[s],
                  fontSize: 12,
                  fontWeight: lead.stage === s ? 800 : 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {lead.stage === s ? "✓ " : ""}
                {s}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {showVisit && (
        <ScheduleVisitModal
          lead={lead}
          onClose={() => setShowVisit(false)}
          onSchedule={(d) => {
            onSchedule(lead.id, d);
            setShowVisit(false);
          }}
        />
      )}

      {showReassign && (
        <Modal onClose={() => setShowReassign(false)} title="Reassign Lead">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {agents.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  onReassign(lead.id, a.id);
                  setShowReassign(false);
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `2px solid ${
                    lead.assignedAgent === a.id ? a.color : "#E2E8F0"
                  }`,
                  background:
                    lead.assignedAgent === a.id ? `${a.color}10` : "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Avatar agent={a} size={34} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{a.email}</div>
                </div>
                {lead.assignedAgent === a.id && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: a.color,
                      fontWeight: 700,
                    }}
                  >
                    Current
                  </span>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeadDetail;
