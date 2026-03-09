import { useState } from "react";
import { STAGES, STAGE_COLORS } from "../constants";
import { needsFollowUp } from "../utils/helpers";
import Avatar from "../components/ui/Avatar";
import ScheduleVisitModal from "../components/ScheduleVisitModal";
import { SourceBadge } from "../components/ui/Badge";

const Pipeline = ({ leads, agents, onMove, openLead, onSchedule }) => {
  const [dragged,     setDragged]     = useState(null);
  const [visitModal,  setVisitModal]  = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 24,
            color: "#0F172A",
            fontWeight: 800,
          }}
        >
          Pipeline View
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
          Drag &amp; drop cards between stages to update status
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 12,
          alignItems: "flex-start",
        }}
      >
        {STAGES.map((stage) => {
          const col = leads.filter((l) => l.stage === stage);
          const c   = STAGE_COLORS[stage];

          return (
            <div key={stage} style={{ minWidth: 214, flexShrink: 0 }}>
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 9,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1E293B" }}>
                    {stage}
                  </span>
                </div>
                <span
                  style={{
                    background: `${c}20`,
                    color: c,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 8px",
                    borderRadius: 20,
                  }}
                >
                  {col.length}
                </span>
              </div>

              {/* Drop zone */}
              <div
                className="drop-zone"
                id={`col-${stage}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  document.getElementById(`col-${stage}`).classList.add("over");
                }}
                onDragLeave={() =>
                  document.getElementById(`col-${stage}`).classList.remove("over")
                }
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById(`col-${stage}`).classList.remove("over");
                  if (dragged) {
                    onMove(dragged, stage);
                    setDragged(null);
                  }
                }}
                style={{
                  background: "#F4F6FA",
                  borderRadius: 12,
                  padding: 8,
                  minHeight: 420,
                  border: "2px solid transparent",
                }}
              >
                {col.map((lead) => {
                  const ag = agents.find((a) => a.id === lead.assignedAgent);
                  const fu = needsFollowUp(lead);

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setDragged(lead.id)}
                      onDragEnd={() => setDragged(null)}
                      className="card-hover"
                      style={{
                        background: "white",
                        borderRadius: 10,
                        padding: 13,
                        marginBottom: 8,
                        cursor: "grab",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        border: `1px solid ${fu ? "#FECACA" : "#F1F5F9"}`,
                        borderLeft: `3px solid ${c}`,
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
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#0F172A",
                            lineHeight: 1.3,
                          }}
                        >
                          {lead.name}
                        </div>
                        {fu && (
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#EF4444",
                              flexShrink: 0,
                            }}
                            title="Follow-up needed"
                          />
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: 10,
                          color: "#94A3B8",
                          marginBottom: 8,
                        }}
                      >
                        {lead.phone}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <SourceBadge source={lead.source} />
                        <Avatar agent={ag} size={22} />
                      </div>

                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => openLead(lead)}
                          style={{
                            flex: 1,
                            padding: "4px",
                            borderRadius: 6,
                            border: "1px solid #E2E8F0",
                            background: "white",
                            fontSize: 10,
                            cursor: "pointer",
                            color: "#64748B",
                            fontWeight: 600,
                          }}
                        >
                          View
                        </button>
                        {!["Booked", "Lost"].includes(stage) && (
                          <button
                            onClick={() => setVisitModal(lead.id)}
                            style={{
                              flex: 1,
                              padding: "4px",
                              borderRadius: 6,
                              border: "1px solid #FF6B3530",
                              background: "#FFF7ED",
                              fontSize: 10,
                              cursor: "pointer",
                              color: "#C2410C",
                              fontWeight: 600,
                            }}
                          >
                            + Visit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {col.length === 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#CBD5E1",
                      textAlign: "center",
                      padding: "28px 8px",
                    }}
                  >
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visitModal && (
        <ScheduleVisitModal
          lead={leads.find((l) => l.id === visitModal)}
          onClose={() => setVisitModal(null)}
          onSchedule={(data) => {
            onSchedule(visitModal, data);
            setVisitModal(null);
          }}
        />
      )}
    </div>
  );
};

export default Pipeline;
