import { useState } from "react";
import { STAGES } from "../constants";
import { needsFollowUp, fmtDate } from "../utils/helpers";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import ScheduleVisitModal from "../components/ScheduleVisitModal";
import { StageBadge, SourceBadge, FUBadge } from "../components/ui/Badge";
import { STAGE_COLORS } from "../constants";

const LeadsTable = ({ leads, agents, openLead, setPage, onMove, onSchedule }) => {
  const [search,    setSearch]    = useState("");
  const [fStage,    setFStage]    = useState("");
  const [fAgent,    setFAgent]    = useState("");
  const [moveModal, setMoveModal] = useState(null); // leadId
  const [visitModal,setVisitModal]= useState(null); // leadId

  const list = leads.filter((l) => {
    const matches =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    return (
      matches &&
      (!fStage || l.stage === fStage) &&
      (!fAgent || l.assignedAgent === fAgent)
    );
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 24,
              color: "#0F172A",
              fontWeight: 800,
            }}
          >
            Leads Management
          </h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
            {list.length} leads · {leads.filter(needsFollowUp).length} need follow-up
          </p>
        </div>
        <button
          onClick={() => setPage("capture")}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: "linear-gradient(135deg,#FF6B35,#FF8C5A)",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(255,107,53,0.35)",
          }}
        >
          + New Lead
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <input
          placeholder="Search name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1.5px solid #E2E8F0",
            fontSize: 13,
            background: "white",
          }}
        />
        <select
          value={fStage}
          onChange={(e) => setFStage(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1.5px solid #E2E8F0",
            fontSize: 13,
            background: "white",
            color: "#374151",
          }}
        >
          <option value="">All Stages</option>
          {STAGES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={fAgent}
          onChange={(e) => setFAgent(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1.5px solid #E2E8F0",
            fontSize: 13,
            background: "white",
            color: "#374151",
          }}
        >
          <option value="">All Agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #F1F5F9" }}>
              {["Lead", "Phone", "Source", "Agent", "Stage", "Created", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94A3B8",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {list.map((lead) => {
              const ag = agents.find((a) => a.id === lead.assignedAgent);
              const fu = needsFollowUp(lead);
              return (
                <tr
                  key={lead.id}
                  className="lead-row"
                  style={{ borderBottom: "1px solid #F8FAFC", background: "white" }}
                >
                  {/* Name */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "#EEF2FF",
                          color: "#4338CA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
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
                          style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}
                        >
                          {lead.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 5,
                            marginTop: 2,
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: 9, color: "#CBD5E1" }}>
                            {lead.id}
                          </span>
                          {fu && <FUBadge />}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                    {lead.phone}
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <SourceBadge source={lead.source} />
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Avatar agent={ag} size={24} />
                      <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>
                        {ag?.name?.split(" ")[0]}
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <StageBadge stage={lead.stage} />
                  </td>

                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#94A3B8" }}>
                    {fmtDate(lead.createdAt)}
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        onClick={() => openLead(lead)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1.5px solid #E2E8F0",
                          background: "white",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => setMoveModal(lead.id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid #6366F120",
                          background: "#EEF2FF",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 600,
                          color: "#4338CA",
                        }}
                      >
                        Move
                      </button>
                      <button
                        onClick={() => setVisitModal(lead.id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid #FF6B3520",
                          background: "#FFF7ED",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 600,
                          color: "#C2410C",
                        }}
                      >
                        Visit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "#94A3B8",
              fontSize: 14,
            }}
          >
            No leads match your filters
          </div>
        )}
      </div>

      {/* Move Stage Modal */}
      {moveModal && (
        <Modal onClose={() => setMoveModal(null)} title="Move Lead Stage">
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>
            Moving:{" "}
            <strong>{leads.find((l) => l.id === moveModal)?.name}</strong>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onMove(moveModal, s);
                  setMoveModal(null);
                }}
                style={{
                  padding: "10px",
                  borderRadius: 10,
                  border: `1.5px solid ${STAGE_COLORS[s]}50`,
                  background: `${STAGE_COLORS[s]}12`,
                  color: STAGE_COLORS[s],
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Schedule Visit Modal */}
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

export default LeadsTable;
