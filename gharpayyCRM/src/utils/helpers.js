export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDT = (iso) => `${fmtDate(iso)}, ${fmtTime(iso)}`;

export const since = (iso) => {
  const d = (Date.now() - new Date(iso)) / 60000;
  if (d < 60)   return `${Math.floor(d)}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
};

export const needsFollowUp = (lead) =>
  Date.now() - new Date(lead.lastActivityAt) > 86400000 &&
  !["Booked", "Lost"].includes(lead.stage);

export const uid = (prefix) =>
  prefix + Math.random().toString(36).slice(2, 7).toUpperCase();

export const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
