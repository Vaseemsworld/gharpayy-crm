import { useState } from "react";
import { StageBadge, SourceBadge } from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";

// ─── Automation Rules ────────────────────────────────────
const RULES = [
  {
    id: "r1",
    trigger: "Lead Assigned",
    stage: null,
    delay: "Instant",
    template: "welcome",
    active: true,
    icon: "✦",
    color: "#6366F1",
    desc: "Fires when a new lead is created and assigned to an agent.",
  },
  {
    id: "r2",
    trigger: "Stage → Contacted",
    stage: "Contacted",
    delay: "Instant",
    template: "contacted",
    active: true,
    icon: "💬",
    color: "#3B82F6",
    desc: "Sent when the agent marks the lead as Contacted.",
  },
  {
    id: "r3",
    trigger: "Visit Scheduled",
    stage: "Visit Scheduled",
    delay: "1 hr before visit",
    template: "visit_reminder",
    active: true,
    icon: "🏠",
    color: "#F59E0B",
    desc: "Reminder sent to the lead 1 hour before their scheduled property visit.",
  },
  {
    id: "r4",
    trigger: "No Activity – 24 hrs",
    stage: null,
    delay: "24h after last activity",
    template: "followup",
    active: true,
    icon: "🔔",
    color: "#EF4444",
    desc: "Auto follow-up if the lead has had no activity for 24 hours.",
  },
  {
    id: "r5",
    trigger: "Booking Confirmed",
    stage: "Booked",
    delay: "Instant",
    template: "booking_confirm",
    active: true,
    icon: "✅",
    color: "#10B981",
    desc: "Welcome message sent when a PG booking is confirmed.",
  },
  {
    id: "r6",
    trigger: "Visit No Show",
    stage: null,
    delay: "2 hrs after missed visit",
    template: "noshow",
    active: false,
    icon: "⚠️",
    color: "#8B5CF6",
    desc: "Sent if a visit is marked as No Show — offers to reschedule.",
  },
];

// ─── Message Templates ────────────────────────────────────
const TEMPLATES = {
  welcome: {
    name: "Welcome Message",
    body: `Hi {{lead_name}} 👋

Thanks for your interest in finding a PG in Bangalore!

I'm {{agent_name}} from Gharpayy. I'll be helping you find the perfect PG accommodation. 🏘️

I'll reach out to you shortly to understand your requirements.

Meanwhile, check out our properties: gharpayy.com/bangalore`,
  },
  contacted: {
    name: "Requirement Collection",
    body: `Hi {{lead_name}},

It was great connecting with you! 😊

To suggest the best PG options, could you share:
• Preferred area in Bangalore?
• Budget per month?
• Single / Double / Triple occupancy?
• Any other preferences (AC, food, etc.)?

Reply anytime — I'm here to help! 🏠`,
  },
  visit_reminder: {
    name: "Visit Reminder",
    body: `Hi {{lead_name}} 👋

Reminder: Your property visit is scheduled in 1 hour!

📍 *{{property_name}}*
📅 {{visit_date}} at {{visit_time}}
👤 Agent: {{agent_name}}

See you there! If you need to reschedule, reply to this message.

— Team Gharpayy 🏘️`,
  },
  followup: {
    name: "24-Hour Follow Up",
    body: `Hi {{lead_name}},

Just checking in! 👋

Have you had a chance to consider the PG options we discussed? 🏠

We have some great options in your preferred area and budget. Would you like to schedule a visit?

Reply YES and I'll set it up right away!

— {{agent_name}}, Gharpayy`,
  },
  booking_confirm: {
    name: "Booking Confirmation",
    body: `Hi {{lead_name}} 🎉

*Congratulations! Your PG booking is confirmed!*

🏠 *{{property_name}}*
📅 Move-in Date: {{move_in_date}}
👤 Your Agent: {{agent_name}}

Next steps:
1. Pay the security deposit
2. Complete KYC documentation
3. Collect room keys on move-in day

Welcome to Gharpayy! 🏘️`,
  },
  noshow: {
    name: "Visit No Show",
    body: `Hi {{lead_name}},

We missed you at the property visit today! 😊

No worries — we'd love to reschedule at a time that works for you.

Reply with your preferred day and time and we'll sort it out right away!

— {{agent_name}}, Gharpayy 🏠`,
  },
};

// ─── Simulated message log ────────────────────────────────
const INIT_LOG = [
  {
    id: "m1",
    lead: "Arjun Mehta",
    phone: "+91 98001 11111",
    template: "welcome",
    agent: "Priya Sharma",
    time: "2h ago",
    status: "Delivered",
  },
  {
    id: "m2",
    lead: "Divya Krishnan",
    phone: "+91 98001 22222",
    template: "contacted",
    agent: "Rahul Verma",
    time: "3h ago",
    status: "Read",
  },
  {
    id: "m3",
    lead: "Rohit Gupta",
    phone: "+91 98001 33333",
    template: "visit_reminder",
    agent: "Sneha Patel",
    time: "4h ago",
    status: "Read",
  },
  {
    id: "m4",
    lead: "Vikram Nair",
    phone: "+91 98001 55555",
    template: "followup",
    agent: "Rahul Verma",
    time: "25h ago",
    status: "Delivered",
  },
  {
    id: "m5",
    lead: "Anjali Singh",
    phone: "+91 98001 44444",
    template: "booking_confirm",
    agent: "Priya Sharma",
    time: "4h ago",
    status: "Read",
  },
  {
    id: "m6",
    lead: "Meera Iyer",
    phone: "+91 98001 88888",
    template: "noshow",
    agent: "Rahul Verma",
    time: "6h ago",
    status: "Failed",
  },
];

const STATUS_STYLE = {
  Delivered: ["#EFF6FF", "#1D4ED8", "📤"],
  Read: ["#F0FDF4", "#166534", "✓✓"],
  Failed: ["#FEF2F2", "#991B1B", "✗"],
  Sent: ["#F8FAFC", "#64748B", "📨"],
};

// ─── API Code snippet ────────────────────────────────────
const CODE_SNIPPET = `// Django — send WhatsApp via Interakt API
# views.py

import requests

INTERAKT_API_KEY = settings.INTERAKT_API_KEY
INTERAKT_URL = "https://api.interakt.ai/v1/public/message/"

def send_whatsapp(phone: str, template: str, params: dict):
    payload = {
        "countryCode": "+91",
        "phoneNumber": phone,
        "callbackData": "gharpayy_crm",
        "type": "Template",
        "template": {
            "name": template,
            "languageCode": "en",
            "bodyValues": list(params.values())
        }
    }
    headers = {
        "Authorization": f"Basic {INTERAKT_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(INTERAKT_URL, json=payload, headers=headers)
    return response.json()

# Celery task — fires on lead assignment
@shared_task
def send_welcome_message(lead_id: str):
    lead = Lead.objects.select_related("assigned_agent").get(id=lead_id)
    send_whatsapp(
        phone=lead.phone,
        template="gharpayy_welcome",
        params={
            "lead_name":  lead.name,
            "agent_name": lead.assigned_agent.name,
        }
    )
    Activity.objects.create(
        lead=lead,
        activity_type="whatsapp",
        description=f"WhatsApp welcome message sent to {lead.phone}"
    )

# Signal — trigger on lead save
@receiver(post_save, sender=Lead)
def on_lead_created(sender, instance, created, **kwargs):
    if created:
        send_welcome_message.delay(instance.id)`;

// ─── Component ────────────────────────────────────────────
const WhatsApp = ({ leads, agents }) => {
  const [activeRule, setActiveRule] = useState(null);
  const [activeTab, setActiveTab] = useState("rules"); // rules | templates | log | api
  const [rules, setRules] = useState(RULES);
  const [log, setLog] = useState(INIT_LOG);
  const [testPhone, setTestPhone] = useState("");
  const [testTemplate, setTestTemplate] = useState("welcome");
  const [testSent, setTestSent] = useState(false);
  const [previewTpl, setPreviewTpl] = useState("welcome");

  const toggleRule = (id) =>
    setRules((r) =>
      r.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
    );

  const handleTest = () => {
    if (!testPhone.trim()) return;
    const newMsg = {
      id: "m" + Date.now(),
      lead: "Test Lead",
      phone: testPhone,
      template: testTemplate,
      agent: "Admin",
      time: "Just now",
      status: "Sent",
    };
    setLog((l) => [newMsg, ...l]);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
    setTestPhone("");
  };

  const activeCount = rules.filter((r) => r.active).length;
  const readCount = log.filter((m) => m.status === "Read").length;
  const failCount = log.filter((m) => m.status === "Failed").length;

  const TAB_STYLE = (t) => ({
    padding: "9px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: activeTab === t ? "#161D35" : "white",
    color: activeTab === t ? "white" : "#64748B",
    boxShadow: activeTab === t ? "0 2px 8px rgba(22,29,53,0.2)" : "none",
    transition: "all 0.15s",
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Sora,sans-serif",
              fontSize: 24,
              color: "#0F172A",
              fontWeight: 800,
            }}
          >
            WhatsApp Automation
          </h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
            Powered by Interakt API · {activeCount} rules active · {log.length}{" "}
            messages sent
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F0FDF4",
            border: "1px solid #86EFAC",
            borderRadius: 12,
            padding: "8px 16px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10B981",
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>
            API Connected
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          ["Active Rules", activeCount, "#25D366", "⚡"],
          ["Messages Sent", log.length, "#3B82F6", "📤"],
          [
            "Read Rate",
            `${Math.round((readCount / log.length) * 100)}%`,
            "#10B981",
            "✓✓",
          ],
          ["Failed", failCount, "#EF4444", "✗"],
        ].map(([label, value, color, icon]) => (
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Sora,sans-serif",
                    fontSize: 26,
                    fontWeight: 800,
                    color,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  {label}
                </div>
              </div>
              <span style={{ fontSize: 22 }}>{icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: "#F1F5F9",
          padding: 5,
          borderRadius: 14,
          width: "fit-content",
        }}
      >
        {[
          ["rules", "⚡ Rules"],
          ["templates", "📝 Templates"],
          ["log", "📋 Message Log"],
          ["api", "</> API Concept"],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t)} style={TAB_STYLE(t)}>
            {l}
          </button>
        ))}
      </div>

      {/* ── TAB: RULES ── */}
      {activeTab === "rules" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rules.map((rule) => (
            <div
              key={rule.id}
              onClick={() =>
                setActiveRule(activeRule === rule.id ? null : rule.id)
              }
              style={{
                background: "white",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: `1px solid ${rule.active ? rule.color + "30" : "#F1F5F9"}`,
                borderLeft: `4px solid ${rule.active ? rule.color : "#E2E8F0"}`,
                cursor: "pointer",
                opacity: rule.active ? 1 : 0.55,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: rule.color + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {rule.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}
                  >
                    {rule.trigger}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                    {rule.desc}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94A3B8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Delay
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        marginTop: 2,
                      }}
                    >
                      {rule.delay}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94A3B8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Template
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: rule.color,
                        marginTop: 2,
                      }}
                    >
                      {TEMPLATES[rule.template]?.name}
                    </div>
                  </div>
                  {/* Toggle */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRule(rule.id);
                    }}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: rule.active ? "#25D366" : "#CBD5E1",
                      cursor: "pointer",
                      position: "relative",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: rule.active ? 23 : 3,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.2s",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded preview */}
              {activeRule === rule.id && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 10,
                    }}
                  >
                    Message Preview
                  </div>
                  <div
                    style={{
                      background: "#DCF8C6",
                      borderRadius: "16px 16px 4px 16px",
                      padding: "12px 16px",
                      maxWidth: 340,
                      fontSize: 12,
                      lineHeight: 1.7,
                      color: "#1A1A1A",
                      whiteSpace: "pre-wrap",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      fontFamily: "monospace",
                    }}
                  >
                    {TEMPLATES[rule.template]?.body}
                  </div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 6 }}>
                    ✓✓ Delivered via Interakt · WhatsApp Business API
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: TEMPLATES ── */}
      {activeTab === "templates" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}
        >
          {/* Template list */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
              height: "fit-content",
            }}
          >
            {Object.entries(TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                onClick={() => setPreviewTpl(key)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: previewTpl === key ? "#F1F5F9" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 4,
                  borderLeft:
                    previewTpl === key
                      ? "3px solid #25D366"
                      : "3px solid transparent",
                }}
              >
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}
                >
                  {tpl.name}
                </div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                  {key}
                </div>
              </button>
            ))}
          </div>

          {/* Template preview */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Sora,sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {TEMPLATES[previewTpl]?.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Template ID:{" "}
                  <code
                    style={{
                      background: "#F1F5F9",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontSize: 11,
                    }}
                  >
                    gharpayy_{previewTpl}
                  </code>
                </div>
              </div>
              <span
                style={{
                  background: "#F0FDF4",
                  color: "#166534",
                  border: "1px solid #86EFAC",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                ✓ Approved
              </span>
            </div>

            {/* WhatsApp phone mockup */}
            <div
              style={{
                background: "#ECE5DD",
                borderRadius: 16,
                padding: 20,
                maxWidth: 360,
              }}
            >
              <div
                style={{
                  background: "#25D366",
                  borderRadius: "12px 12px 0 0",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  🏘️
                </div>
                <div>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: "white" }}
                  >
                    Gharpayy
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>
                    Business Account · online
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#DCF8C6",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "12px 14px",
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#1A1A1A",
                  whiteSpace: "pre-wrap",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {TEMPLATES[previewTpl]?.body}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#8B8B8B",
                  textAlign: "right",
                  marginTop: 4,
                }}
              >
                {new Date().toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ✓✓
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                background: "#F8FAFC",
                borderRadius: 10,
                padding: 14,
                border: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Dynamic Variables
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "{{lead_name}}",
                  "{{agent_name}}",
                  "{{property_name}}",
                  "{{visit_date}}",
                  "{{visit_time}}",
                  "{{move_in_date}}",
                ].map((v) => (
                  <span
                    key={v}
                    style={{
                      background: "#EEF2FF",
                      color: "#4338CA",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: LOG ── */}
      {activeTab === "log" && (
        <div>
          {/* Test send */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
              display: "flex",
              gap: 12,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Send Test Message
              </label>
              <input
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ width: 200 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Template
              </label>
              <select
                value={testTemplate}
                onChange={(e) => setTestTemplate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 13,
                  background: "white",
                }}
              >
                {Object.entries(TEMPLATES).map(([k, t]) => (
                  <option key={k} value={k}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleTest}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                background: testSent
                  ? "#10B981"
                  : "linear-gradient(135deg,#25D366,#128C7E)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {testSent ? "✓ Sent!" : "Send Test →"}
            </button>
          </div>

          {/* Log table */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#F8FAFC",
                    borderBottom: "2px solid #F1F5F9",
                  }}
                >
                  {["Lead", "Phone", "Template", "Agent", "Time", "Status"].map(
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
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {log.map((msg) => {
                  const [bg, clr, icon] =
                    STATUS_STYLE[msg.status] || STATUS_STYLE.Sent;
                  return (
                    <tr
                      key={msg.id}
                      className="lead-row"
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0F172A",
                        }}
                      >
                        {msg.lead}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: "#64748B",
                        }}
                      >
                        {msg.phone}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: "#F0FDF4",
                            color: "#166534",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {TEMPLATES[msg.template]?.name}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: "#374151",
                        }}
                      >
                        {msg.agent}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: "#94A3B8",
                        }}
                      >
                        {msg.time}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: bg,
                            color: clr,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 20,
                          }}
                        >
                          {icon} {msg.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: API ── */}
      {activeTab === "api" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}
        >
          <div
            style={{
              background: "#161D35",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 4px 20px rgba(22,29,53,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                🐍 Django — Interakt API Integration
              </div>
              <span
                style={{
                  background: "#25D36620",
                  color: "#25D366",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  border: "1px solid #25D36640",
                }}
              >
                Python
              </span>
            </div>
            <pre
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "#E2E8F0",
                fontFamily: "monospace",
                margin: 0,
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              <code>{CODE_SNIPPET}</code>
            </pre>
          </div>

          {/* Flow diagram */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: "white",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 14,
                }}
              >
                Message Flow
              </div>
              {[
                ["CRM Action", "Agent changes lead stage", "#6366F1"],
                ["Django Signal", "post_save signal fires", "#3B82F6"],
                ["Celery Task", "Async task queued in Redis", "#F59E0B"],
                ["Interakt API", "POST /v1/public/message/", "#25D366"],
                ["WhatsApp", "Message delivered to lead", "#10B981"],
              ].map(([step, desc, color], i, arr) => (
                <div key={step}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 0",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: color + "20",
                        color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        {step}
                      </div>
                      <div style={{ fontSize: 10, color: "#94A3B8" }}>
                        {desc}
                      </div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        height: 12,
                        background: "#F1F5F9",
                        marginLeft: 13,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 12,
                }}
              >
                Supported BSPs
              </div>
              {[
                ["Interakt", "Recommended for India", "#25D366"],
                ["Twilio", "Global, higher cost", "#F22F46"],
                ["Wati", "Team inbox features", "#0084FF"],
              ].map(([name, note, color]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid #F8FAFC",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0F172A",
                      }}
                    >
                      {name}
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsApp;
