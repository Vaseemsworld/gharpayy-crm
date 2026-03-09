import { STAGE_COLORS, SRC_COLORS } from "../../constants";

export const Badge = ({ label, bg, color }) => (
  <span
    style={{
      background: bg,
      color,
      padding: "2px 9px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

export const StageBadge = ({ stage }) => {
  const c = STAGE_COLORS[stage] || "#6B7280";
  return <Badge label={stage} bg={c + "1A"} color={c} />;
};

export const SourceBadge = ({ source }) => {
  const [bg, clr] = SRC_COLORS[source] || ["#F3F4F6", "#374151"];
  return <Badge label={source} bg={bg} color={clr} />;
};

export const VisitBadge = ({ status }) => {
  const map = {
    Scheduled:       ["#EFF6FF", "#1D4ED8"],
    Visited:         ["#F0FDF4", "#166534"],
    "No Show":       ["#FEF2F2", "#991B1B"],
    Rescheduled:     ["#FFF7ED", "#92400E"],
    Booked:          ["#ECFDF5", "#065F46"],
    "Not Interested":["#F9FAFB", "#6B7280"],
  };
  const [bg, clr] = map[status] || ["#F3F4F6", "#374151"];
  return <Badge label={status} bg={bg} color={clr} />;
};

export const FUBadge = () => (
  <span
    style={{
      background: "#FEF2F2",
      color: "#DC2626",
      border: "1px solid #FECACA",
      padding: "1px 7px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
    }}
  >
    🔴 Follow Up
  </span>
);
