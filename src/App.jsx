import { useState, useRef, useEffect } from "react";

const plans = [
  {
    name: "NY PPO $1650 [HSA]",
    type: "PPO/POS",
    yourPremium: 0,
    deductible: 1650,
    oopMax: 3000,
    copayPCP: "$30",
    copaySpecialist: "$45",
    copayER: "$400",
    coinsurance: "0% after ded",
    outOfNetwork: true,
    hsa: true,
    hospitalCopay: "$750/stay",
    tag: "🏦 HSA-eligible · Lowest premium",
    color: "#2563eb",
    pros: ["$0 premium", "HSA eligible", "Lowest OOP max ($3,000)", "Free after deductible for most services"],
    cons: ["Must meet $1,650 deductible first", "High upfront cost if you need care early in year"],
    bestFor: "Healthy people who rarely use healthcare, or those who want to save pre-tax dollars via HSA."
  },
  {
    name: "NY PPO $2000",
    type: "PPO/POS",
    yourPremium: 0,
    deductible: 2000,
    oopMax: 8000,
    copayPCP: "$25",
    copaySpecialist: "$75",
    copayER: "$500",
    coinsurance: "0% after ded",
    outOfNetwork: true,
    hsa: false,
    hospitalCopay: "0% after ded",
    tag: "💸 $0 premium · High deductible",
    color: "#7c3aed",
    pros: ["$0 premium", "0% coinsurance after deductible", "Out-of-network covered"],
    cons: ["$2,000 deductible", "$8,000 OOP max", "$500 ER copay"],
    bestFor: "People who want $0 premium and mostly see in-network providers."
  },
  {
    name: "NY PPO $1000",
    type: "PPO/POS",
    yourPremium: 9.57,
    deductible: 1000,
    oopMax: 7000,
    copayPCP: "$25",
    copaySpecialist: "$50",
    copayER: "$350",
    coinsurance: "20% after ded",
    outOfNetwork: true,
    hsa: false,
    hospitalCopay: "20% after ded",
    tag: "⚖️ Balanced · Low deductible",
    color: "#059669",
    pros: ["Low $9.57/mo premium", "$1,000 deductible", "Out-of-network coverage", "Lower ER copay ($350)"],
    cons: ["20% coinsurance after deductible", "$7,000 OOP max"],
    bestFor: "Moderate healthcare users who want a lower deductible with out-of-network flexibility."
  },
  {
    name: "NY EPO 0/45",
    type: "EPO",
    yourPremium: 49.09,
    deductible: 0,
    oopMax: 5500,
    copayPCP: "$45",
    copaySpecialist: "$65",
    copayER: "$400",
    coinsurance: "N/A",
    outOfNetwork: false,
    hsa: false,
    hospitalCopay: "$500/day (5 days)",
    tag: "🏥 No deductible · In-network only",
    color: "#d97706",
    pros: ["No deductible", "$5,500 OOP max", "Predictable copays from day one"],
    cons: ["$49.09/mo premium", "NO out-of-network coverage", "Higher PCP copay ($45)"],
    bestFor: "Frequent healthcare users who want immediate coverage and know all their doctors are in-network."
  },
  {
    name: "NY EPO 0/30",
    type: "EPO",
    yourPremium: 135.40,
    deductible: 0,
    oopMax: 5000,
    copayPCP: "$30",
    copaySpecialist: "$65",
    copayER: "$400",
    coinsurance: "N/A",
    outOfNetwork: false,
    hsa: false,
    hospitalCopay: "$750/stay",
    tag: "🩺 Best copays · No deductible",
    color: "#dc2626",
    pros: ["No deductible", "Lowest OOP max ($5,000)", "Low $30 PCP copay"],
    cons: ["$135.40/mo premium", "NO out-of-network coverage"],
    bestFor: "High healthcare users with chronic conditions who have predictable in-network care."
  },
  {
    name: "NY PPO $1250",
    type: "PPO/POS",
    yourPremium: 144.87,
    deductible: 1250,
    oopMax: 3500,
    copayPCP: "$20",
    copaySpecialist: "$40",
    copayER: "$250",
    coinsurance: "10% after ded",
    outOfNetwork: true,
    hsa: false,
    hospitalCopay: "10% after ded",
    tag: "⭐ Best benefits · Higher premium",
    color: "#0891b2",
    pros: ["Lowest copays ($20 PCP, $40 specialist)", "Lowest ER copay ($250)", "Only 10% coinsurance", "Low $3,500 OOP max", "Out-of-network covered"],
    cons: ["$144.87/mo premium", "$1,250 deductible"],
    bestFor: "Anyone with significant ongoing healthcare needs who values low cost-sharing and flexibility."
  },
  {
    name: "NY PPO 0/30",
    type: "PPO/POS",
    yourPremium: 450.12,
    deductible: 0,
    oopMax: 5000,
    copayPCP: "$30",
    copaySpecialist: "N/A",
    copayER: "$400",
    coinsurance: "30% after ded",
    outOfNetwork: true,
    hsa: false,
    hospitalCopay: "$500/day (3 days)",
    tag: "💰 No deductible · Very high premium",
    color: "#9d174d",
    pros: ["No deductible", "Out-of-network coverage", "$30 PCP copay"],
    cons: ["$450.12/mo — $5,401/yr!", "Premium alone nearly equals OOP max"],
    bestFor: "Rarely the best choice given the extreme premium cost."
  }
];

const PLAN_CONTEXT = plans.map(p =>
  `Plan: ${p.name} | Type: ${p.type} | Your monthly premium: $${p.yourPremium} | Deductible: $${p.deductible} | OOP Max: $${p.oopMax} | PCP copay: ${p.copayPCP} | Specialist copay: ${p.copaySpecialist} | ER copay: ${p.copayER} | Hospital: ${p.hospitalCopay} | Out-of-network: ${p.outOfNetwork ? "Yes" : "No"} | HSA eligible: ${p.hsa ? "Yes" : "No"} | Best for: ${p.bestFor}`
).join("\n");

const SYSTEM_PROMPT = `You are a friendly, knowledgeable health insurance advisor helping someone choose between their Aetna health plans offered through their employer (Rippling PEO 1, Inc.) for the coverage period December 2025 - November 2026.

Here are the available plans:
${PLAN_CONTEXT}

Your job:
1. Ask friendly, conversational questions to understand the user's health situation, usage patterns, financial preferences, and any specific needs (pregnancy, chronic conditions, planned surgeries, medications, etc.)
2. Based on their answers, recommend the best plan(s) with clear reasoning
3. Explain trade-offs in plain English with real dollar examples when helpful
4. Be warm, concise, and avoid jargon
5. Never give medical advice — only help with plan selection
6. Always remind them you're not a licensed insurance advisor and they should confirm provider networks before enrolling
7. Keep responses concise — 3-5 sentences typically, longer only when doing a detailed recommendation

Start by warmly greeting the user and asking a few opening questions to understand their situation.`;

export default function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: "Hi! 👋 I'm your health plan advisor. I'm here to help you pick the best Aetna plan from the options your employer offers.\n\nTo point you in the right direction, let me ask a few quick questions:\n\n1. **How often do you typically see a doctor?** (annual checkup only, a few times a year, or frequently/monthly?)\n2. **Do you have any ongoing health conditions, take regular medications, or have any major procedures planned?**\n3. **Do you have a preference — lower monthly cost, or lower costs when you actually use care?**\n\nFeel free to answer all at once or just start wherever feels natural!"
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const togglePlan = (name) => {
    setSelectedPlans(prev => prev.includes(name) ? prev.filter(p => p !== name) : prev.length < 3 ? [...prev, name] : prev);
  };

  const comparePlans = plans.filter(p => selectedPlans.includes(p.name));

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 920, margin: "0 auto", padding: 16, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>Aetna Health Plan Guide</h1>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Dec 2025 – Nov 2026 · 7 plans available</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["chat","💬 AI Advisor"], ["overview","📋 All Plans"], ["compare","⚖️ Compare"], ["scenarios","🎯 Scenarios"]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
            background: activeTab === tab ? "#1e293b" : "#e2e8f0", color: activeTab === tab ? "white" : "#475569"
          }}>{label}</button>
        ))}
      </div>

      {activeTab === "scenarios" && (
        <div style={{ display: "grid", gap: 14 }}>
          {[
            { title: "🧘 Healthy, Rarely See a Doctor", desc: "You go for your annual physical and maybe 1-2 sick visits per year.", recommendation: "NY PPO $1650 [HSA]", reason: "Your $0 premium means you pay nothing monthly. Annual physicals are free (preventive). With an HSA, you can save pre-tax money for future medical expenses. You're unlikely to hit your deductible." },
            { title: "👶 Planning a Baby / Pregnant", desc: "Prenatal visits, delivery, hospital stay — significant healthcare year ahead.", recommendation: "NY PPO $1250", reason: "The $1,250 deductible is manageable, 10% coinsurance is low, and the $3,500 OOP max caps your exposure. A hospital delivery typically costs $10k+, so low cost-sharing matters a lot here." },
            { title: "💊 Chronic Condition (Regular Specialist Visits)", desc: "You see a specialist monthly and take ongoing prescriptions.", recommendation: "NY EPO 0/30 or NY PPO $1250", reason: "EPO 0/30: No deductible, $30 copays mean predictable low costs from day 1 — but only if all your doctors are in-network. PPO $1250: Better if you need out-of-network specialists or want flexibility." },
            { title: "🏃 Active / Accident-Prone", desc: "You play sports and could need an ER visit or surgery.", recommendation: "NY PPO $1250", reason: "The lowest ER copay ($250) and only 10% coinsurance for surgery/hospital means your unexpected costs stay manageable. The $3,500 OOP max is a strong safety net." },
            { title: "💼 Generally Healthy, Want Peace of Mind", desc: "You rarely use care but want protection if something big happens.", recommendation: "NY PPO $1000", reason: "Only $9.57/mo, $1,000 deductible is reasonable, out-of-network covered. A good middle ground between the free HSA plan and pricier options." },
            { title: "🏥 Frequent Healthcare User (Predictable Visits)", desc: "Regular doctor visits, you know all your providers are in-network.", recommendation: "NY EPO 0/45", reason: "No deductible so coverage kicks in immediately, $49/mo premium is moderate. If you have many visits per year, skipping the deductible saves you real money vs. the PPO plans." }
          ].map(s => (
            <div key={s.title} style={{ background: "white", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>{s.desc}</div>
              <div style={{ background: "#eff6ff", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", marginBottom: 4 }}>✅ RECOMMENDED: {s.recommendation}</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>{s.reason}</div>
              </div>
            </div>
          ))}
          <div style={{ background: "#fefce8", borderRadius: 12, padding: 16, border: "1px solid #fde047", fontSize: 13, color: "#713f12" }}>
            <strong>⚠️ Note:</strong> These are general guidelines. Always verify your providers are in-network before enrolling, especially for EPO plans which provide no out-of-network coverage (except emergencies).
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column", height: 580 }}>
          <div style={{ background: "linear-gradient(135deg, #1e293b, #334155)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Plan Advisor AI</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>Powered by Claude · Here to help you choose</div>
            </div>
            <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
                {m.role === "assistant" && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.role === "user" ? "#2563eb" : "#f1f5f9",
                  color: m.role === "user" ? "white" : "#1e293b", fontSize: 14, lineHeight: 1.6
                }} dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                {m.role === "user" && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>👤</div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#f1f5f9", display: "flex", gap: 6, alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#94a3b8", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 10 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your answer or question... (Enter to send)"
              rows={2}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", resize: "none",
                fontSize: 14, fontFamily: "inherit", outline: "none", lineHeight: 1.5
              }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              padding: "0 18px", borderRadius: 12, border: "none",
              background: loading || !input.trim() ? "#e2e8f0" : "#2563eb",
              color: loading || !input.trim() ? "#94a3b8" : "white",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: 20
            }}>➤</button>
          </div>

          <div style={{ padding: "6px 16px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["I'm generally healthy", "I have a chronic condition", "I'm planning a pregnancy", "I want the lowest monthly cost", "Explain HSA to me"].map(s => (
              <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }} style={{
                padding: "4px 10px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "white",
                fontSize: 11, color: "#475569", cursor: "pointer", fontFamily: "inherit"
              }}>{s}</button>
            ))}
          </div>
          <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
        </div>
      )}

      {activeTab === "overview" && (
        <div>
          <div style={{ background: "#dbeafe", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#1e40af" }}>
            <strong>Key:</strong> <strong>Deductible</strong> = you pay first before insurance kicks in. <strong>OOP Max</strong> = your yearly worst-case. <strong>Copay</strong> = flat fee per visit. <strong>EPO</strong> = in-network only. <strong>PPO/POS</strong> = in + out-of-network.
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {plans.map(p => (
              <div key={p.name} style={{ background: "white", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${p.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{p.tag}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: p.yourPremium === 0 ? "#16a34a" : "#dc2626" }}>
                      ${p.yourPremium.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 400 }}>/mo</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>${(p.yourPremium * 12).toFixed(0)}/year</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginTop: 14 }}>
                  {[["Deductible", p.deductible === 0 ? "$0 ✅" : `$${p.deductible.toLocaleString()}`],["OOP Max",`$${p.oopMax.toLocaleString()}`],["PCP Visit",p.copayPCP],["Specialist",p.copaySpecialist],["ER Visit",p.copayER],["Out-of-Network",p.outOfNetwork?"✅ Yes":"❌ No"],["HSA",p.hsa?"✅ Yes":"—"]].map(([label,val])=>(
                    <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 600, marginTop: 2 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>✅ Pros</div>
                    {p.pros.map((x,i) => <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>• {x}</div>)}
                  </div>
                  <div style={{ background: "#fef2f2", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠️ Cons</div>
                    {p.cons.map((x,i) => <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>• {x}</div>)}
                  </div>
                </div>
                <div style={{ marginTop: 8, background: "#eff6ff", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#1d4ed8" }}>
                  <strong>Best for:</strong> {p.bestFor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Select up to 3 plans to compare:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {plans.map(p => (
              <button key={p.name} onClick={() => togglePlan(p.name)} style={{
                padding: "6px 12px", borderRadius: 20, border: `2px solid ${selectedPlans.includes(p.name) ? p.color : "#e2e8f0"}`,
                background: selectedPlans.includes(p.name) ? p.color : "white", color: selectedPlans.includes(p.name) ? "white" : "#475569",
                cursor: "pointer", fontSize: 12, fontWeight: 600
              }}>{p.name}</button>
            ))}
          </div>
          {comparePlans.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Select plans above to compare</div>}
          {comparePlans.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 12px", background: "#f1f5f9", color: "#475569", fontWeight: 700 }}>Feature</th>
                    {comparePlans.map(p => (
                      <th key={p.name} style={{ padding: "10px 12px", background: p.color, color: "white", fontWeight: 700, textAlign: "center" }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Monthly Premium", p => `$${p.yourPremium.toFixed(2)}`],
                    ["Annual Premium", p => `$${(p.yourPremium * 12).toFixed(0)}`],
                    ["Deductible", p => p.deductible === 0 ? "$0 ✅" : `$${p.deductible.toLocaleString()}`],
                    ["OOP Max", p => `$${p.oopMax.toLocaleString()}`],
                    ["PCP Copay", p => p.copayPCP],
                    ["Specialist Copay", p => p.copaySpecialist],
                    ["ER Copay", p => p.copayER],
                    ["Hospital", p => p.hospitalCopay],
                    ["Coinsurance", p => p.coinsurance],
                    ["Out-of-Network", p => p.outOfNetwork ? "✅ Yes" : "❌ No"],
                    ["HSA Eligible", p => p.hsa ? "✅ Yes" : "—"],
                  ].map(([label, fn], i) => (
                    <tr key={label} style={{ background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>{label}</td>
                      {comparePlans.map(p => (
                        <td key={p.name} style={{ padding: "10px 12px", textAlign: "center", color: "#1e293b" }}>{fn(p)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
