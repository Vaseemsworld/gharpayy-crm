import { STAGES, STAGE_COLORS } from "../constants";
import Avatar from "../components/ui/Avatar";

const AgentPerf = ({ agents, leads, visits }) => {
  const stats = agents
    .map((ag) => {
      const al = leads.filter((l) => l.assignedAgent === ag.id);
      const bk = al.filter((l) => l.stage === "Booked").length;
      const ls = al.filter((l) => l.stage === "Lost").length;
      const av = visits.filter(
        (v) => leads.find((l) => l.id === v.leadId)?.assignedAgent === ag.id
      );
      return {
        ...ag,
        total:  al.length,
        active: al.filter((l) => !["Booked", "Lost"].includes(l.stage)).length,
        visits: av.length,
        booked: bk,
        lost:   ls,
        conv:   al.length ? Math.round((bk / al.length) * 100) : 0,
      };
    })
    .sort((a, b) => b.booked - a.booked);

  const medals = ["🥇", "🥈", "🥉"];
  const medalBg = ["#FEF3C7", "#F1F5F9", "#FFF7ED"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 24,
            color: "#0F172A",
            fontWeight: 800,
          }}
        >
          Agent Performance
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
          Leaderboard · All-time stats
        </p>
      </div>

      {/* Leaderboard rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {stats.map((ag, i) => (
          <div
            key={ag.id}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${ag.color}`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: medalBg[i] || "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {medals[i] || `#${i + 1}`}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <Avatar agent={ag} size={46} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  {ag.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{ag.email}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                ["Leads",  ag.total,          "#6366F1"],
                ["Active", ag.active,          "#3B82F6"],
                ["Visits", ag.visits,          "#F59E0B"],
                ["Booked", ag.booked,          "#10B981"],
                ["Lost",   ag.lost,            "#EF4444"],
                ["Conv%",  `${ag.conv}%`,      "#8B5CF6"],
              ].map(([label, value, color]) => (
                <div key={label} style={{ textAlign: "center", minWidth: 44 }}>
                  <div
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color,
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#94A3B8",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline distribution by agent */}
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
            fontSize: 15,
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: 18,
          }}
        >
          Pipeline Distribution by Agent
        </h3>
        {stats.map((ag) => {
          const al = leads.filter((l) => l.assignedAgent === ag.id);
          return (
            <div key={ag.id} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <Avatar agent={ag} size={26} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  {ag.name}
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                  {al.length} leads
                </span>
              </div>

              {/* Stacked bar */}
              <div
                style={{
                  display: "flex",
                  height: 12,
                  borderRadius: 6,
                  overflow: "hidden",
                  gap: 1,
                  marginBottom: 6,
                }}
              >
                {STAGES.map((s) => {
                  const n = al.filter((l) => l.stage === s).length;
                  const p = al.length ? (n / al.length) * 100 : 0;
                  return p > 0 ? (
                    <div
                      key={s}
                      title={`${s}: ${n}`}
                      style={{ width: `${p}%`, background: STAGE_COLORS[s] }}
                    />
                  ) : null;
                })}
              </div>

              {/* Stage labels */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {STAGES.filter(
                  (s) => al.filter((l) => l.stage === s).length > 0
                ).map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 10,
                      color: STAGE_COLORS[s],
                      fontWeight: 700,
                    }}
                  >
                    {s}: {al.filter((l) => l.stage === s).length}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPerf;
