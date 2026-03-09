import { useState, useEffect } from "react";
import Avatar from "../components/ui/Avatar";
import { StageBadge, SourceBadge } from "../components/ui/Badge";

// ─── Staleness thresholds ─────────────────────────────────
const THRESHOLDS = {
  URGENT: 24, // hrs — auto-reassign fires
  WARNING: 12, // hrs — orange
  CAUTION: 6, // hrs — yellow
};

// const getStaleness = (lastActivityAt) => {
//   const hrs = (Date.now() - new Date(lastActivityAt)) / 3600000;
//   return hrs;
// };

const getStaleLevel = (hrs) => {
  if (hrs >= THRESHOLDS.URGENT) return "urgent";
  if (hrs >= THRESHOLDS.WARNING) return "warning";
  if (hrs >= THRESHOLDS.CAUTION) return "caution";
  return "fresh";
};

const LEVEL_STYLES = {
  fresh: {
    bg: "#F0FDF4",
    border: "#86EFAC",
    color: "#166534",
    label: "Active",
    dot: "#10B981",
  },
  caution: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    color: "#92400E",
    label: "Slow",
    dot: "#F59E0B",
  },
  warning: {
    bg: "#FFF7ED",
    border: "#FDBA74",
    color: "#C2410C",
    label: "At Risk",
    dot: "#F97316",
  },
  urgent: {
    bg: "#FEF2F2",
    border: "#FECACA",
    color: "#991B1B",
    label: "Reassign Now",
    dot: "#EF4444",
  },
};

const fmtHrs = (hrs) => {
  if (hrs < 1) return `${Math.floor(hrs * 60)}m`;
  if (hrs < 24) return `${hrs.toFixed(1)}h`;
  return `${Math.floor(hrs / 24)}d ${Math.floor(hrs % 24)}h`;
};

// Countdown bar — fills toward 24h threshold
const StaleBar = ({ hrs }) => {
  const pct = Math.min((hrs / THRESHOLDS.URGENT) * 100, 100);
  const color =
    pct >= 100
      ? "#EF4444"
      : pct >= 50
        ? "#F97316"
        : pct >= 25
          ? "#F59E0B"
          : "#10B981";
  return (
    <div
      style={{
        height: 5,
        background: "#F1F5F9",
        borderRadius: 3,
        overflow: "hidden",
        marginTop: 5,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 0.4s",
        }}
      />
    </div>
  );
};

// ─── Log ─────────────────────────────────────────────────
const INIT_REASSIGN_LOG = [
  {
    id: "rl1",
    leadName: "Suresh Kumar",
    fromAgent: "Priya Sharma",
    toAgent: "Rahul Verma",
    hrs: 52,
    reason: "No activity for 52h",
    time: "2 days ago",
  },
  {
    id: "rl2",
    leadName: "Ravi Chandran",
    fromAgent: "Sneha Patel",
    toAgent: "Priya Sharma",
    hrs: 28,
    reason: "No activity for 28h",
    time: "Yesterday",
  },
];

// ─── Component ────────────────────────────────────────────
const AutoReassign = ({ leads, agents, onReassign, activities }) => {
  const [now, setNow] = useState(Date.now());
  const [threshold, setThreshold] = useState(24);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [log, setLog] = useState(INIT_REASSIGN_LOG);
  const [reassigned, setReassigned] = useState({}); // leadId → true
  const [rrPointer, setRrPointer] = useState(0);

  // Tick every 30s so timers stay live
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // Only track active (non-Booked, non-Lost) leads
  const activeLeads = leads
    .filter((l) => !["Booked", "Lost"].includes(l.stage))
    .map((l) => ({ ...l, hrs: (now - new Date(l.lastActivityAt)) / 3600000 }))
    .sort((a, b) => b.hrs - a.hrs);

  const urgentLeads = activeLeads.filter((l) => l.hrs >= threshold);
  const warningLeads = activeLeads.filter(
    (l) => l.hrs >= THRESHOLDS.WARNING && l.hrs < threshold,
  );
  const healthyLeads = activeLeads.filter((l) => l.hrs < THRESHOLDS.WARNING);

  const handleReassign = (lead) => {
    if (reassigned[lead.id]) return;
    // Pick next agent (skip current)
    const others = agents.filter((a) => a.id !== lead.assignedAgent);
    const next = others[rrPointer % others.length];
    setRrPointer((p) => p + 1);

    onReassign(lead.id, next.id);
    setReassigned((r) => ({ ...r, [lead.id]: next }));

    const entry = {
      id: "rl" + Date.now(),
      leadName: lead.name,
      fromAgent: agents.find((a) => a.id === lead.assignedAgent)?.name || "—",
      toAgent: next.name,
      hrs: Math.round(lead.hrs),
      reason: `No activity for ${fmtHrs(lead.hrs)}`,
      time: "Just now",
    };
    setLog((l) => [entry, ...l]);
  };

  const handleReassignAll = () => {
    urgentLeads.filter((l) => !reassigned[l.id]).forEach(handleReassign);
  };

  const nextAgent = (currentId) => {
    const others = agents.filter((a) => a.id !== currentId);
    return others[rrPointer % others.length];
  };

  const LeadRow = ({ lead, highlight }) => {
    const level = getStaleLevel(lead.hrs);
    const style = LEVEL_STYLES[level];
    const ag = agents.find((a) => a.id === lead.assignedAgent);
    const done = !!reassigned[lead.id];
    const newAg = done ? reassigned[lead.id] : nextAgent(lead.assignedAgent);

    return (
      <div
        style={{
          background: done ? "#F0FDF4" : highlight ? style.bg : "white",
          border: `1px solid ${done ? "#86EFAC" : highlight ? style.border : "#F1F5F9"}`,
          borderRadius: 12,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          transition: "all 0.2s",
          opacity: done ? 0.75 : 1,
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: done ? "#10B981" : style.dot,
            flexShrink: 0,
            boxShadow:
              !done && level === "urgent" ? `0 0 0 3px ${style.dot}30` : "none",
          }}
        />

        {/* Lead info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
              {lead.name}
            </span>
            <span style={{ fontSize: 9, color: "#CBD5E1" }}>{lead.id}</span>
            <StageBadge stage={lead.stage} />
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>
            {lead.phone} · <SourceBadge source={lead.source} />
          </div>
          <StaleBar hrs={lead.hrs} />
        </div>

        {/* Timer */}
        <div style={{ textAlign: "center", minWidth: 72 }}>
          <div
            style={{
              fontFamily: "Sora,sans-serif",
              fontSize: 20,
              fontWeight: 800,
              color: done ? "#10B981" : style.color,
            }}
          >
            {done ? "✓" : fmtHrs(lead.hrs)}
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: done ? "#10B981" : style.color,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {done ? "Reassigned" : style.label}
          </div>
        </div>

        {/* Agent arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 220,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Avatar agent={ag} size={30} />
            <div
              style={{
                fontSize: 9,
                color: "#94A3B8",
                marginTop: 3,
                maxWidth: 60,
                lineHeight: 1.2,
              }}
            >
              {ag?.name?.split(" ")[0]}
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: done ? "#10B981" : "#CBD5E1",
              fontWeight: 800,
            }}
          >
            →
          </div>
          <div style={{ textAlign: "center" }}>
            <Avatar agent={newAg} size={30} />
            <div
              style={{
                fontSize: 9,
                color: done ? "#10B981" : "#94A3B8",
                marginTop: 3,
                maxWidth: 60,
                lineHeight: 1.2,
                fontWeight: done ? 700 : 400,
              }}
            >
              {newAg?.name?.split(" ")[0]}
            </div>
          </div>
        </div>

        {/* Action button */}
        {!done ? (
          <button
            onClick={() => handleReassign(lead)}
            style={{
              padding: "8px 14px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              background: level === "urgent" ? "#EF4444" : "#F1F5F9",
              color: level === "urgent" ? "white" : "#374151",
              whiteSpace: "nowrap",
              flexShrink: 0,
              boxShadow:
                level === "urgent" ? "0 2px 8px rgba(239,68,68,0.35)" : "none",
            }}
          >
            Reassign →
          </button>
        ) : (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#10B981",
              flexShrink: 0,
              minWidth: 82,
              textAlign: "center",
            }}
          >
            ✓ Done
          </span>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Sora,sans-serif",
              fontSize: 24,
              color: "#0F172A",
              fontWeight: 800,
            }}
          >
            Auto-Reassignment
          </h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
            Monitors agent response time · {urgentLeads.length} lead
            {urgentLeads.length !== 1 ? "s" : ""} need reassignment now
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {urgentLeads.filter((l) => !reassigned[l.id]).length > 0 && (
            <button
              onClick={handleReassignAll}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#EF4444,#F87171)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
              }}
            >
              Reassign All (
              {urgentLeads.filter((l) => !reassigned[l.id]).length}) →
            </button>
          )}
        </div>
      </div>

      {/* Settings card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
            Auto-Reassign
          </span>
          <div
            onClick={() => setAutoEnabled((e) => !e)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: autoEnabled ? "#6366F1" : "#CBD5E1",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: autoEnabled ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "left 0.2s",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              color: autoEnabled ? "#6366F1" : "#94A3B8",
              fontWeight: 700,
            }}
          >
            {autoEnabled ? "ON" : "OFF"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
            Trigger after
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {[6, 12, 24, 48].map((h) => (
              <button
                key={h}
                onClick={() => setThreshold(h)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  background: threshold === h ? "#161D35" : "#F1F5F9",
                  color: threshold === h ? "white" : "#64748B",
                  transition: "all 0.15s",
                }}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginLeft: "auto",
          }}
        >
          {[
            [`${urgentLeads.length}`, "Reassign Now", "#EF4444"],
            [`${warningLeads.length}`, "At Risk", "#F97316"],
            [`${healthyLeads.length}`, "Active", "#10B981"],
          ].map(([n, l, c]) => (
            <div
              key={l}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: c,
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: c }}>
                {n}
              </span>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div>
          {/* Urgent */}
          {urgentLeads.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#EF4444",
                  }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                >
                  Reassign Now — No activity ≥ {threshold}h
                </span>
                <span
                  style={{
                    background: "#FEF2F2",
                    color: "#DC2626",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 8px",
                    borderRadius: 20,
                  }}
                >
                  {urgentLeads.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {urgentLeads.map((l) => (
                  <LeadRow key={l.id} lead={l} highlight />
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          {warningLeads.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#F97316",
                  }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                >
                  At Risk — No activity {THRESHOLDS.WARNING}–{threshold}h
                </span>
                <span
                  style={{
                    background: "#FFF7ED",
                    color: "#C2410C",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 8px",
                    borderRadius: 20,
                  }}
                >
                  {warningLeads.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {warningLeads.map((l) => (
                  <LeadRow key={l.id} lead={l} highlight />
                ))}
              </div>
            </div>
          )}

          {/* Healthy */}
          {healthyLeads.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10B981",
                  }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                >
                  Active — All good
                </span>
                <span
                  style={{
                    background: "#F0FDF4",
                    color: "#166534",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 8px",
                    borderRadius: 20,
                  }}
                >
                  {healthyLeads.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {healthyLeads.map((l) => (
                  <LeadRow key={l.id} lead={l} highlight={false} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "sticky",
            top: 20,
          }}
        >
          {/* Reassignment Log */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: 14,
              }}
            >
              ⇄ Reassignment Log
            </h3>
            {log.slice(0, 8).map((entry) => {
              const fromAg = agents.find((a) => a.name === entry.fromAgent);
              const toAg = agents.find((a) => a.name === entry.toAgent);
              return (
                <div
                  key={entry.id}
                  style={{
                    paddingBottom: 12,
                    marginBottom: 12,
                    borderBottom: "1px solid #F8FAFC",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0F172A",
                      }}
                    >
                      {entry.leadName}
                    </span>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>
                      {entry.time}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Avatar
                      agent={
                        fromAg || {
                          initials: entry.fromAgent.slice(0, 2),
                          color: "#94A3B8",
                        }
                      }
                      size={20}
                    />
                    <span style={{ fontSize: 11, color: "#64748B" }}>
                      {entry.fromAgent.split(" ")[0]}
                    </span>
                    <span
                      style={{
                        color: "#6366F1",
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      →
                    </span>
                    <Avatar
                      agent={
                        toAg || {
                          initials: entry.toAgent.slice(0, 2),
                          color: "#6366F1",
                        }
                      }
                      size={20}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6366F1",
                        fontWeight: 600,
                      }}
                    >
                      {entry.toAgent.split(" ")[0]}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      background: "#FEF2F2",
                      padding: "2px 8px",
                      borderRadius: 6,
                      display: "inline-block",
                    }}
                  >
                    {entry.reason}
                  </div>
                </div>
              );
            })}
            {log.length === 0 && (
              <div
                style={{
                  fontSize: 12,
                  color: "#94A3B8",
                  textAlign: "center",
                  padding: 16,
                }}
              >
                No reassignments yet
              </div>
            )}
          </div>

          {/* How it works */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: 14,
              }}
            >
              ⚙️ How Auto-Reassign Works
            </h3>
            {[
              [
                "1",
                "Celery Beat checks every 30 min for leads with last_activity_at > threshold",
                "#6366F1",
              ],
              [
                "2",
                "Flagged leads are marked 'Reassign Pending' in DB",
                "#F59E0B",
              ],
              [
                "3",
                "Lead is assigned to next agent in Round Robin (excluding current)",
                "#3B82F6",
              ],
              ["4", "WhatsApp notification sent to new agent", "#25D366"],
              [
                "5",
                "Activity logged: 'Auto-reassigned from X to Y after Nh inactivity'",
                "#10B981",
              ],
            ].map(([n, t, c]) => (
              <div
                key={n}
                style={{ display: "flex", gap: 10, marginBottom: 12 }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: c + "20",
                    color: c,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6 }}
                >
                  {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoReassign;
