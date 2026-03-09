import { useState } from "react";
import "./index.css";

import { uid } from "./utils/helpers";
import {
  INIT_AGENTS,
  INIT_LEADS,
  INIT_VISITS,
  INIT_ACTS,
} from "./data/seedData";

import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import LeadsTable from "./pages/LeadsTable";
import Pipeline from "./pages/Pipeline";
import LeadDetail from "./pages/LeadDetail";
import VisitPlanner from "./pages/VisitPlanner";
import NewLead from "./pages/NewLead";
import AgentPerf from "./pages/AgentPerf";
import WhatsApp from "./pages/Whatsapp";
// import AutoReassign from "./pages/AutoReassign";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [leads, setLeads] = useState(INIT_LEADS);
  const [visits, setVisits] = useState(INIT_VISITS);
  const [acts, setActs] = useState(INIT_ACTS);
  const [agents] = useState(INIT_AGENTS);
  const [selLead, setSelLead] = useState(null);
  const [rrIdx, setRrIdx] = useState(INIT_LEADS.length % INIT_AGENTS.length);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const addAct = (leadId, type, desc) =>
    setActs((p) => [
      ...p,
      {
        id: uid("ac"),
        leadId,
        type,
        desc,
        createdAt: new Date().toISOString(),
      },
    ]);

  const touchLead = (leadId) =>
    setLeads((p) =>
      p.map((l) =>
        l.id === leadId
          ? { ...l, lastActivityAt: new Date().toISOString() }
          : l,
      ),
    );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleMove = (leadId, stage) => {
    setLeads((p) =>
      p.map((l) =>
        l.id === leadId
          ? { ...l, stage, lastActivityAt: new Date().toISOString() }
          : l,
      ),
    );
    addAct(leadId, "stage", `Stage moved to ${stage}`);
  };

  const handleSchedule = (leadId, data) => {
    setVisits((p) => [
      ...p,
      { id: uid("V"), leadId, ...data, status: "Scheduled" },
    ]);
    addAct(
      leadId,
      "visit",
      `Visit scheduled at ${data.property} on ${data.date}`,
    );
    handleMove(leadId, "Visit Scheduled");
  };

  const handleNote = (leadId, note) => {
    setLeads((p) =>
      p.map((l) =>
        l.id === leadId
          ? { ...l, notes: note, lastActivityAt: new Date().toISOString() }
          : l,
      ),
    );
    addAct(
      leadId,
      "note",
      `Note: "${note.slice(0, 60)}${note.length > 60 ? "…" : ""}"`,
    );
  };

  const handleReassign = (leadId, agentId) => {
    const ag = agents.find((a) => a.id === agentId);
    setLeads((p) =>
      p.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedAgent: agentId,
              lastActivityAt: new Date().toISOString(),
            }
          : l,
      ),
    );
    addAct(leadId, "reassigned", `Reassigned to ${ag?.name}`);
  };

  const handleVisitOutcome = (visitId, outcome) => {
    const v = visits.find((x) => x.id === visitId);
    setVisits((p) =>
      p.map((x) => (x.id === visitId ? { ...x, status: outcome } : x)),
    );
    if (v) {
      addAct(v.leadId, "visit", `Visit outcome: ${outcome}`);
      touchLead(v.leadId);
      if (outcome === "Booked") handleMove(v.leadId, "Booked");
      if (outcome === "Visited") handleMove(v.leadId, "Visit Completed");
    }
  };

  const handleNewLead = (form) => {
    const ag = agents[rrIdx % agents.length];
    setRrIdx((c) => c + 1);
    const nl = {
      id: "L" + String(leads.length + 1).padStart(3, "0"),
      name: form.name,
      phone: form.phone,
      source: form.source,
      assignedAgent: ag.id,
      stage: "New Lead",
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      notes: "",
    };
    setLeads((p) => [...p, nl]);
    setActs((p) => [
      ...p,
      {
        id: uid("ac"),
        leadId: nl.id,
        type: "created",
        desc: `Lead created from ${form.source}`,
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("ac"),
        leadId: nl.id,
        type: "assigned",
        desc: `Assigned to ${ag.name}`,
        createdAt: new Date().toISOString(),
      },
    ]);
    return nl;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const openLead = (lead) => {
    setSelLead(lead);
    setPage("detail");
  };

  const navTo = (p) => {
    setPage(p);
    if (p !== "detail") setSelLead(null);
  };

  const curLead = selLead && leads.find((l) => l.id === selLead.id);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF1F8" }}>
      <Sidebar page={page} setPage={navTo} />

      <div
        style={{
          marginLeft: 228,
          flex: 1,
          padding: "28px 30px",
          minHeight: "100vh",
        }}
      >
        {page === "dashboard" && (
          <Dashboard
            leads={leads}
            visits={visits}
            agents={agents}
            setPage={navTo}
            openLead={openLead}
          />
        )}
        {page === "leads" && (
          <LeadsTable
            leads={leads}
            agents={agents}
            openLead={openLead}
            setPage={navTo}
            onMove={handleMove}
            onSchedule={handleSchedule}
          />
        )}
        {page === "pipeline" && (
          <Pipeline
            leads={leads}
            agents={agents}
            onMove={handleMove}
            openLead={openLead}
            onSchedule={handleSchedule}
          />
        )}
        {page === "detail" && curLead && (
          <LeadDetail
            lead={curLead}
            agents={agents}
            activities={acts}
            visits={visits}
            onBack={() => navTo("leads")}
            onMove={handleMove}
            onNote={handleNote}
            onSchedule={handleSchedule}
            onReassign={handleReassign}
            onVisitOutcome={handleVisitOutcome}
          />
        )}
        {page === "visits" && (
          <VisitPlanner
            visits={visits}
            leads={leads}
            agents={agents}
            onOutcome={handleVisitOutcome}
          />
        )}
        {page === "capture" && (
          <NewLead onSubmit={handleNewLead} agents={agents} rrIdx={rrIdx} />
        )}
        {page === "agents" && (
          <AgentPerf agents={agents} leads={leads} visits={visits} />
        )}
        {page === "whatsapp" && <WhatsApp leads={leads} agents={agents} />}
        {/* {page === "reassign" && (
          <AutoReassign
            leads={leads}
            agents={agents}
            onReassign={handleReassign}
            activities={acts}
          />
        )} */}
      </div>
    </div>
  );
}
