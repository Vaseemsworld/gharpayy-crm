import { STAGES, STAGE_COLORS } from "../constants";
import { todayStr, tomorrowStr } from "../data/seedData";
import { needsFollowUp, since } from "../utils/helpers";
import Stat from "../components/ui/Stat";
import Avatar from "../components/ui/Avatar";
import { StageBadge, FUBadge } from "../components/ui/Badge";

const Dashboard = ({ leads, visits, agents, openLead }) => {
  const stageCounts = STAGES.reduce(
    (acc, s) => ({ ...acc, [s]: leads.filter((l) => l.stage === s).length }),
    {}
  );

  const todayVis  = visits.filter((v) => v.date === todayStr    && v.status === "Scheduled");
  const tmrwVis   = visits.filter((v) => v.date === tomorrowStr && v.status === "Scheduled");
  const fuLeads   = leads.filter(needsFollowUp);
  const newToday  = leads.filter(
    (l) => new Date(l.createdAt) > new Date(Date.now() - 86400000)
  ).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 26,
            color: "#0F172A",
            fontWeight: 800,
          }}
        >
          CRM Dashboard
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · Gharpayy Bangalore
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 15,
          marginBottom: 22,
        }}
      >
        <Stat label="Total Leads"        value={leads.length}                                    icon="👥" color="#6366F1" sub={`+${newToday} today`} />
        <Stat label="Bookings Confirmed" value={stageCounts["Booked"] || 0}                     icon="✅" color="#10B981" sub="Closed deals" />
        <Stat label="Visits Scheduled"   value={visits.filter((v) => v.status === "Scheduled").length} icon="🏠" color="#F59E0B" sub={`${todayVis.length} today`} />
        <Stat label="Follow-Up Needed"   value={fuLeads.length}                                 icon="🔔" color="#EF4444" sub="24h no activity" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 18 }}>
        {/* Pipeline Distribution */}
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
            Pipeline Distribution
          </h3>
          {STAGES.map((s) => {
            const n   = stageCounts[s] || 0;
            const pct = leads.length ? Math.round((n / leads.length) * 100) : 0;
            const c   = STAGE_COLORS[s];
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 11,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    width: 168,
                    fontSize: 12,
                    color: "#374151",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {s}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "#F1F5F9",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: c,
                      borderRadius: 4,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 24,
                    fontSize: 12,
                    fontWeight: 800,
                    color: c,
                    textAlign: "right",
                  }}
                >
                  {n}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Upcoming Visits */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
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
              🗓️ Upcoming Visits
            </h3>
            {[
              ...todayVis.map((v) => ({ ...v, lbl: "Today" })),
              ...tmrwVis.map((v) => ({ ...v, lbl: "Tomorrow" })),
            ]
              .slice(0, 5)
              .map((v) => {
                const lead = leads.find((l) => l.id === v.leadId);
                return (
                  <div
                    key={v.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      paddingBottom: 9,
                      marginBottom: 9,
                      borderBottom: "1px solid #F8FAFC",
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: v.lbl === "Today" ? "#FF6B35" : "#6366F1",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}
                      >
                        {lead?.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#94A3B8" }}>
                        {v.property.replace("Gharpayy ", "")} · {v.time}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        background: v.lbl === "Today" ? "#FFF7ED" : "#EEF2FF",
                        color: v.lbl === "Today" ? "#C2410C" : "#4338CA",
                        padding: "2px 6px",
                        borderRadius: 20,
                      }}
                    >
                      {v.lbl}
                    </span>
                  </div>
                );
              })}
            {todayVis.length === 0 && tmrwVis.length === 0 && (
              <div
                style={{
                  fontSize: 12,
                  color: "#94A3B8",
                  textAlign: "center",
                  padding: 12,
                }}
              >
                No upcoming visits
              </div>
            )}
          </div>

          {/* Follow-Up Needed */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
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
              🔴 Follow-Up Needed
            </h3>
            {fuLeads.slice(0, 4).map((l) => {
              const ag = agents.find((a) => a.id === l.assignedAgent);
              return (
                <div
                  key={l.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 9,
                    cursor: "pointer",
                  }}
                  onClick={() => openLead(l)}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#EF4444",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}
                    >
                      {l.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>
                      {since(l.lastActivityAt)} · {ag?.name?.split(" ")[0]}
                    </div>
                  </div>
                  <StageBadge stage={l.stage} />
                </div>
              );
            })}
            {fuLeads.length === 0 && (
              <div
                style={{
                  fontSize: 12,
                  color: "#10B981",
                  textAlign: "center",
                  padding: 12,
                }}
              >
                ✓ All leads are active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Overview */}
      <div
        style={{
          marginTop: 18,
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <h3
          style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}
        >
          Agent Overview
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
          }}
        >
          {agents.map((ag) => {
            const al = leads.filter((l) => l.assignedAgent === ag.id);
            const bk = al.filter((l) => l.stage === "Booked").length;
            const av = visits.filter(
              (v) => leads.find((l) => l.id === v.leadId)?.assignedAgent === ag.id
            );
            return (
              <div
                key={ag.id}
                style={{
                  padding: 16,
                  background: "#F8FAFC",
                  borderRadius: 12,
                  border: "1px solid #F1F5F9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <Avatar agent={ag} size={36} />
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}
                    >
                      {ag.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>{ag.email}</div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  {[
                    ["Leads",  al.length, "#6366F1"],
                    ["Visits", av.length, "#F59E0B"],
                    ["Booked", bk,        "#10B981"],
                  ].map(([label, val, color]) => (
                    <div
                      key={label}
                      style={{
                        background: "white",
                        borderRadius: 8,
                        padding: "8px 4px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "Sora, sans-serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color,
                        }}
                      >
                        {val}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#94A3B8",
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
