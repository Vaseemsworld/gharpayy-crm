const T = Date.now();
const ago = (h) => new Date(T - h * 3600000).toISOString();
const ds  = (iso) => iso.split("T")[0];

export const todayStr    = ds(new Date().toISOString());
export const tomorrowStr = ds(new Date(T + 86400000).toISOString());

export const INIT_AGENTS = [
  { id: "a1", name: "Priya Sharma", email: "priya@gharpayy.com", phone: "+91 98765 43210", initials: "PS", color: "#FF6B35" },
  { id: "a2", name: "Rahul Verma",  email: "rahul@gharpayy.com", phone: "+91 98765 43211", initials: "RV", color: "#6366F1" },
  { id: "a3", name: "Sneha Patel",  email: "sneha@gharpayy.com", phone: "+91 98765 43212", initials: "SP", color: "#10B981" },
];

export const INIT_LEADS = [
  { id: "L001", name: "Arjun Mehta",    phone: "+91 98001 11111", source: "Website",      assignedAgent: "a1", stage: "New Lead",              createdAt: ago(2),  lastActivityAt: ago(2),  notes: "Looking for PG near office in Koramangala" },
  { id: "L002", name: "Divya Krishnan", phone: "+91 98001 22222", source: "WhatsApp",     assignedAgent: "a2", stage: "Contacted",             createdAt: ago(5),  lastActivityAt: ago(3),  notes: "Wants single occupancy, budget ₹12,000" },
  { id: "L003", name: "Rohit Gupta",    phone: "+91 98001 33333", source: "Google Form",  assignedAgent: "a3", stage: "Visit Scheduled",       createdAt: ago(28), lastActivityAt: ago(1),  notes: "Budget ₹8000–10000/month, prefers AC room" },
  { id: "L004", name: "Anjali Singh",   phone: "+91 98001 44444", source: "Phone",        assignedAgent: "a1", stage: "Booked",                createdAt: ago(72), lastActivityAt: ago(4),  notes: "Booked Koramangala PG, joining 15th March" },
  { id: "L005", name: "Vikram Nair",    phone: "+91 98001 55555", source: "Tally Form",   assignedAgent: "a2", stage: "Requirement Collected", createdAt: ago(30), lastActivityAt: ago(25), notes: "Needs parking, 2 people sharing" },
  { id: "L006", name: "Pooja Reddy",    phone: "+91 98001 66666", source: "Social Media", assignedAgent: "a3", stage: "Property Suggested",    createdAt: ago(48), lastActivityAt: ago(2),  notes: "Prefers BTM Layout, close to metro" },
  { id: "L007", name: "Suresh Kumar",   phone: "+91 98001 77777", source: "Website",      assignedAgent: "a1", stage: "Lost",                  createdAt: ago(96), lastActivityAt: ago(48), notes: "Found accommodation elsewhere" },
  { id: "L008", name: "Meera Iyer",     phone: "+91 98001 88888", source: "WhatsApp",     assignedAgent: "a2", stage: "Visit Completed",       createdAt: ago(24), lastActivityAt: ago(2),  notes: "Visit went well, considering Indiranagar PG" },
  { id: "L009", name: "Kiran Joshi",    phone: "+91 98001 99999", source: "Google Form",  assignedAgent: "a3", stage: "New Lead",              createdAt: ago(1),  lastActivityAt: ago(1),  notes: "" },
  { id: "L010", name: "Ankit Sharma",   phone: "+91 98001 10101", source: "Phone",        assignedAgent: "a1", stage: "Contacted",             createdAt: ago(12), lastActivityAt: ago(10), notes: "Interested in HSR Layout, called back" },
  { id: "L011", name: "Neha Gupta",     phone: "+91 98001 11100", source: "Website",      assignedAgent: "a2", stage: "Booked",                createdAt: ago(60), lastActivityAt: ago(5),  notes: "Booked BTM Layout, check-in tomorrow" },
  { id: "L012", name: "Ravi Chandran",  phone: "+91 98001 12121", source: "Tally Form",   assignedAgent: "a3", stage: "New Lead",              createdAt: ago(26), lastActivityAt: ago(26), notes: "" },
  { id: "L013", name: "Preethi Nanda",  phone: "+91 98001 13131", source: "Social Media", assignedAgent: "a1", stage: "Requirement Collected", createdAt: ago(15), lastActivityAt: ago(8),  notes: "Female PG, vegetarian food preferred" },
  { id: "L014", name: "Aditya Bose",    phone: "+91 98001 14141", source: "Website",      assignedAgent: "a2", stage: "Property Suggested",    createdAt: ago(20), lastActivityAt: ago(6),  notes: "Suggested 3 properties, awaiting response" },
  { id: "L015", name: "Smita Kaur",     phone: "+91 98001 15151", source: "WhatsApp",     assignedAgent: "a3", stage: "Contacted",             createdAt: ago(8),  lastActivityAt: ago(7),  notes: "" },
];

export const INIT_VISITS = [
  { id: "V001", leadId: "L003", property: "Gharpayy Koramangala PG", date: todayStr,       time: "11:00", status: "Scheduled", notes: "Meet at reception, bring ID" },
  { id: "V002", leadId: "L008", property: "Gharpayy Indiranagar PG", date: ds(ago(5)),     time: "14:00", status: "Visited",   notes: "" },
  { id: "V003", leadId: "L004", property: "Gharpayy Koramangala PG", date: ds(ago(48)),    time: "10:00", status: "Booked",    notes: "Agreement signed" },
  { id: "V004", leadId: "L011", property: "Gharpayy BTM Layout PG",  date: ds(ago(24)),    time: "16:00", status: "Booked",    notes: "" },
  { id: "V005", leadId: "L006", property: "Gharpayy BTM Layout PG",  date: tomorrowStr,    time: "12:00", status: "Scheduled", notes: "Show triple and double rooms" },
  { id: "V006", leadId: "L014", property: "Gharpayy HSR Layout PG",  date: tomorrowStr,    time: "15:00", status: "Scheduled", notes: "" },
];

export const INIT_ACTS = [
  { id: "ac01", leadId: "L001", type: "created",  desc: "Lead created from Website",                    createdAt: ago(2)  },
  { id: "ac02", leadId: "L001", type: "assigned",  desc: "Assigned to Priya Sharma",                    createdAt: ago(2)  },
  { id: "ac03", leadId: "L002", type: "created",  desc: "Lead created from WhatsApp",                   createdAt: ago(5)  },
  { id: "ac04", leadId: "L002", type: "assigned",  desc: "Assigned to Rahul Verma",                     createdAt: ago(5)  },
  { id: "ac05", leadId: "L002", type: "stage",    desc: "Stage moved to Contacted",                     createdAt: ago(3)  },
  { id: "ac06", leadId: "L003", type: "created",  desc: "Lead created from Google Form",                createdAt: ago(28) },
  { id: "ac07", leadId: "L003", type: "assigned",  desc: "Assigned to Sneha Patel",                     createdAt: ago(28) },
  { id: "ac08", leadId: "L003", type: "stage",    desc: "Stage moved to Contacted",                     createdAt: ago(20) },
  { id: "ac09", leadId: "L003", type: "stage",    desc: "Stage moved to Visit Scheduled",               createdAt: ago(1)  },
  { id: "ac10", leadId: "L003", type: "visit",    desc: "Visit scheduled at Gharpayy Koramangala PG",  createdAt: ago(1)  },
  { id: "ac11", leadId: "L004", type: "created",  desc: "Lead created from Phone",                      createdAt: ago(72) },
  { id: "ac12", leadId: "L004", type: "assigned",  desc: "Assigned to Priya Sharma",                    createdAt: ago(72) },
  { id: "ac13", leadId: "L004", type: "stage",    desc: "Stage moved to Booked",                        createdAt: ago(4)  },
  { id: "ac14", leadId: "L004", type: "booking",  desc: "Booking confirmed – Gharpayy Koramangala PG", createdAt: ago(4)  },
  { id: "ac15", leadId: "L008", type: "created",  desc: "Lead created from WhatsApp",                   createdAt: ago(24) },
  { id: "ac16", leadId: "L008", type: "assigned",  desc: "Assigned to Rahul Verma",                     createdAt: ago(24) },
  { id: "ac17", leadId: "L008", type: "visit",    desc: "Visit completed at Gharpayy Indiranagar PG",  createdAt: ago(5)  },
  { id: "ac18", leadId: "L008", type: "stage",    desc: "Stage moved to Visit Completed",               createdAt: ago(2)  },
  { id: "ac19", leadId: "L011", type: "created",  desc: "Lead created from Website",                    createdAt: ago(60) },
  { id: "ac20", leadId: "L011", type: "assigned",  desc: "Assigned to Rahul Verma",                     createdAt: ago(60) },
  { id: "ac21", leadId: "L011", type: "stage",    desc: "Stage moved to Booked",                        createdAt: ago(5)  },
  { id: "ac22", leadId: "L011", type: "booking",  desc: "Booking confirmed – Gharpayy BTM Layout PG",  createdAt: ago(5)  },
];
