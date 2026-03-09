export const STAGES = [
  "New Lead",
  "Contacted",
  "Requirement Collected",
  "Property Suggested",
  "Visit Scheduled",
  "Visit Completed",
  "Booked",
  "Lost",
];

export const SOURCES = [
  "Website",
  "WhatsApp",
  "Phone",
  "Social Media",
  "Google Form",
  "Tally Form",
];

export const PROPERTIES = [
  "Gharpayy Indiranagar PG",
  "Gharpayy BTM Layout PG",
  "Gharpayy Koramangala PG",
  "Gharpayy HSR Layout PG",
  "Gharpayy Marathahalli PG",
];

export const VISIT_OUTCOMES = [
  "Visited",
  "No Show",
  "Rescheduled",
  "Booked",
  "Not Interested",
];

export const STAGE_COLORS = {
  "New Lead": "#6366F1",
  "Contacted": "#3B82F6",
  "Requirement Collected": "#8B5CF6",
  "Property Suggested": "#F59E0B",
  "Visit Scheduled": "#EC4899",
  "Visit Completed": "#14B8A6",
  "Booked": "#10B981",
  "Lost": "#EF4444",
};

export const SRC_COLORS = {
  Website: ["#DBEAFE", "#1D4ED8"],
  WhatsApp: ["#D1FAE5", "#065F46"],
  Phone: ["#FEF3C7", "#92400E"],
  "Social Media": ["#FCE7F3", "#9D174D"],
  "Google Form": ["#FEE2E2", "#991B1B"],
  "Tally Form": ["#EDE9FE", "#5B21B6"],
};

export const ACT_ICON = {
  created: "✦",
  assigned: "👤",
  stage: "→",
  visit: "🏠",
  booking: "✓",
  note: "📝",
  reassigned: "⇄",
};

export const ACT_CLR = {
  created: "#6366F1",
  assigned: "#3B82F6",
  stage: "#F59E0B",
  visit: "#14B8A6",
  booking: "#10B981",
  note: "#8B5CF6",
  reassigned: "#EC4899",
};

export const NAV = [
  { id: "dashboard", icon: "⬡",  label: "Dashboard" },
  { id: "leads",     icon: "👥", label: "All Leads" },
  { id: "pipeline",  icon: "⊞",  label: "Pipeline" },
  { id: "visits",    icon: "🏠", label: "Visit Planner" },
  { id: "capture",   icon: "＋", label: "New Lead" },
  { id: "agents",    icon: "🏆", label: "Agent Performance" },
];
