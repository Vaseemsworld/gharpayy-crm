import { VISIT_OUTCOMES } from "../constants";
import { todayStr, tomorrowStr } from "../data/seedData";
import Avatar from "../components/ui/Avatar";
import { VisitBadge } from "../components/ui/Badge";

const VisitPlanner = ({ visits, leads, agents, onOutcome }) => {
  const grp = {
    Today:    visits.filter((v) => v.date === todayStr),
    Tomorrow: visits.filter((v) => v.date === tomorrowStr),
    Upcoming: visits.filter((v) => v.date > tomorrowStr && v.status === "Scheduled"),
    Past:     visits
      .filter((v) => v.date < todayStr)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6),
  };

  const dotColor = { Today: "#FF6B35", Tomorrow: "#6366F1", Upcoming: "#3B82F6", Past: "#94A3B8" };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 24,
            color: "#0F172A",
            fontWeight: 800,
          }}
        >
          Visit Planner
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
          {visits.filter((v) => v.status === "Scheduled").length} visits scheduled ·{" "}
          {grp.Today.length} today
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          ["Today",          grp.Today.length,                                               "#FF6B35"],
          ["Tomorrow",       grp.Tomorrow.length,                                            "#6366F1"],
          ["Total Scheduled",visits.filter((v) => v.status === "Scheduled").length,          "#3B82F6"],
          ["Completed",      visits.filter((v) => ["Visited", "Booked"].includes(v.status)).length, "#10B981"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "16px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${color}`,
            }}
          >
            <div
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginTop: 2 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Groups */}
      {Object.entries(grp).map(
        ([group, gv]) =>
          gv.length > 0 && (
            <div key={group} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    display: "inline-block",
                    background: dotColor[group],
                  }}
                />
                {group}
                <span
                  style={{
                    background: "#F1F5F9",
                    color: "#64748B",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 8px",
                    borderRadius: 20,
                  }}
                >
                  {gv.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {gv.map((v) => {
                  const lead = leads.find((l) => l.id === v.leadId);
                  const ag   = agents.find((a) => a.id === lead?.assignedAgent);
                  return (
                    <div
                      key={v.id}
                      style={{
                        background: "white",
                        borderRadius: 14,
                        padding: "18px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        border: "1px solid rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 12,
                          background: "#F0F9FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          flexShrink: 0,
                        }}
                      >
                        🏠
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}
                        >
                          {lead?.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                          {v.property}
                        </div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>
                          📅 {v.date} · ⏰ {v.time} · 👤 {ag?.name}
                        </div>
                        {v.notes && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#78350F",
                              background: "#FFFBEB",
                              padding: "3px 9px",
                              borderRadius: 6,
                              marginTop: 6,
                              display: "inline-block",
                            }}
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
                          gap: 8,
                        }}
                      >
                        <VisitBadge status={v.status} />
                        {v.status === "Scheduled" && (
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) onOutcome(v.id, e.target.value);
                            }}
                            style={{
                              fontSize: 11,
                              padding: "4px 8px",
                              borderRadius: 8,
                              border: "1.5px solid #E2E8F0",
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
                  );
                })}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default VisitPlanner;
