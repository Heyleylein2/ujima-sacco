import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, User, DollarSign, AlertTriangle, Calendar } from "lucide-react";

const OfficerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [note, setNote] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ujima_applications") || "[]");
    setApplications(stored);
  }, []);

  const updateDecision = (id, decision) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, officerDecision: decision, officerNote: note, decidedAt: new Date().toISOString() } : app
    );
    setApplications(updated);
    localStorage.setItem("ujima_applications", JSON.stringify(updated));
    setSelected((prev) => ({ ...prev, officerDecision: decision, officerNote: note }));
    setNote("");
  };

  const filtered = applications.filter((app) => {
    if (filter === "pending") return !app.officerDecision;
    if (filter === "approved") return app.officerDecision === "Approved";
    if (filter === "declined") return app.officerDecision === "Declined";
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => !a.officerDecision).length,
    approved: applications.filter((a) => a.officerDecision === "Approved").length,
    declined: applications.filter((a) => a.officerDecision === "Declined").length,
  };

  const getRiskColor = (guardianText) => {
    if (!guardianText) return "#94A3B8";
    if (guardianText.includes("LOW")) return "var(--ujima-green)";
    if (guardianText.includes("HIGH")) return "var(--ujima-red)";
    return "var(--ujima-gold)";
  };

  const getRiskLabel = (guardianText) => {
    if (!guardianText) return "UNKNOWN";
    if (guardianText.includes("LOW")) return "LOW RISK";
    if (guardianText.includes("HIGH")) return "HIGH RISK";
    return "MEDIUM RISK";
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--ujima-blue)", color: "white", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
          Officer Dashboard
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ujima-blue)" }}>Loan Officer Review Panel</h1>
        <p style={{ color: "#6B7280", marginTop: "4px" }}>Final lending decisions rest with you. AI agents provide recommendations only.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Applications", value: stats.total, color: "var(--ujima-blue)" },
          { label: "Pending Review", value: stats.pending, color: "var(--ujima-gold)" },
          { label: "Approved", value: stats.approved, color: "var(--ujima-green)" },
          { label: "Declined", value: stats.declined, color: "var(--ujima-red)" },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "12px", color: "#6B7280", fontWeight: "500", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "32px", fontWeight: "800", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>

        {/* List */}
        <div>
          <div style={{ display: "flex", gap: "4px", backgroundColor: "white", borderRadius: "12px", padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
            {["all", "pending", "approved", "declined"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", textTransform: "capitalize", border: "none", cursor: "pointer", fontFamily: "inherit", backgroundColor: filter === f ? "var(--ujima-blue)" : "transparent", color: filter === f ? "white" : "#94A3B8" }}>
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.length === 0 ? (
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#9CA3AF", fontSize: "14px" }}>No applications found</p>
                <p style={{ color: "#D1D5DB", fontSize: "12px", marginTop: "4px" }}>Submit a loan application first</p>
              </div>
            ) : (
              filtered.map((app) => (
                <div key={app.id} onClick={() => setSelected(app)} style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: `2px solid ${selected?.id === app.id ? "var(--ujima-blue)" : "transparent"}`, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <p style={{ fontWeight: "700", fontSize: "14px", color: "var(--ujima-blue)" }}>{app.member.fullName}</p>
                      <p style={{ fontSize: "12px", color: "#6B7280" }}>{app.member.occupation}</p>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "999px", backgroundColor: app.officerDecision === "Approved" ? "#DCFCE7" : app.officerDecision === "Declined" ? "#FEE2E2" : "#FEF9C3", color: app.officerDecision === "Approved" ? "var(--ujima-green)" : app.officerDecision === "Declined" ? "var(--ujima-red)" : "#92400E" }}>
                      {app.officerDecision || "PENDING"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--ujima-gold)" }}>KES {Number(app.member.loanAmount).toLocaleString()}</p>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px", backgroundColor: getRiskColor(app.results?.guardian), color: "white" }}>
                      {getRiskLabel(app.results?.guardian)}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{new Date(app.submittedAt).toLocaleDateString("en-KE")}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div>
          {!selected ? (
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "60px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
              <Eye size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
              <p style={{ color: "#9CA3AF", fontWeight: "600" }}>Select an application to review</p>
              <p style={{ color: "#D1D5DB", fontSize: "14px", marginTop: "4px" }}>Click any application on the left</p>
            </div>
          ) : (
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>

              {/* Member header */}
              <div style={{ padding: "24px", backgroundColor: "var(--ujima-blue)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--ujima-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", color: "var(--ujima-blue)" }}>
                      {selected.member.fullName.charAt(0)}
                    </div>
                    <div>
                      <p style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>{selected.member.fullName}</p>
                      <p style={{ color: "#93C5FD", fontSize: "14px" }}>{selected.member.occupation}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "700", padding: "6px 12px", borderRadius: "999px", backgroundColor: selected.officerDecision === "Approved" ? "var(--ujima-green)" : selected.officerDecision === "Declined" ? "var(--ujima-red)" : "var(--ujima-gold)", color: "white" }}>
                    {selected.officerDecision || "PENDING REVIEW"}
                  </span>
                </div>
              </div>

              <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Details grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {[
                    { label: "Loan Amount", value: `KES ${Number(selected.member.loanAmount).toLocaleString()}` },
                    { label: "Purpose", value: selected.member.loanPurpose },
                    { label: "Repayment", value: `${selected.member.repaymentPeriod} months` },
                    { label: "Monthly Income", value: `KES ${Number(selected.member.monthlyIncome).toLocaleString()}` },
                    { label: "Net Surplus", value: `KES ${(Number(selected.member.monthlyIncome) - Number(selected.member.monthlyExpenses)).toLocaleString()}` },
                    { label: "Dependants", value: selected.member.dependants },
                  ].map((item) => (
                    <div key={item.label} style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--ujima-light)" }}>
                      <p style={{ fontSize: "11px", color: "#6B7280" }}>{item.label}</p>
                      <p style={{ fontWeight: "700", fontSize: "13px", color: "var(--ujima-blue)", marginTop: "2px" }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Agent results */}
                {[
                  { key: "scout", label: "🎓 Scout Agent", color: "var(--ujima-green)" },
                  { key: "guardian", label: "🛡️ Guardian Agent", color: "var(--ujima-blue)" },
                  { key: "hunter", label: "🔗 Hunter Agent", color: "var(--ujima-gold)" },
                ].map((agent) => (
                  <div key={agent.key}>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: agent.color, marginBottom: "8px" }}>{agent.label}</p>
                    <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "var(--ujima-light)", borderLeft: `3px solid ${agent.color}`, fontSize: "12px", color: "#374151", whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.6" }}>
                      {selected.results?.[agent.key] || "No data"}
                    </div>
                  </div>
                ))}

                {/* Decision */}
                {!selected.officerDecision ? (
                  <div style={{ padding: "20px", borderRadius: "12px", border: "2px solid var(--ujima-gold)", backgroundColor: "#FFFBEB" }}>
                    <p style={{ fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "4px" }}>Your Decision (PRIDE Framework)</p>
                    <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "12px" }}>AI agents have completed their assessment. Final decision is yours.</p>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add your officer notes here..."
                      style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px", fontSize: "13px", marginBottom: "12px", fontFamily: "inherit", resize: "vertical" }}
                      rows={3}
                    />
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => updateDecision(selected.id, "Approved")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", backgroundColor: "var(--ujima-green)", color: "white", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        <CheckCircle size={16} /> Approve Loan
                      </button>
                      <button onClick={() => updateDecision(selected.id, "Declined")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", backgroundColor: "var(--ujima-red)", color: "white", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        <XCircle size={16} /> Decline Loan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: selected.officerDecision === "Approved" ? "#DCFCE7" : "#FEE2E2" }}>
                    <p style={{ fontWeight: "700", color: selected.officerDecision === "Approved" ? "var(--ujima-green)" : "var(--ujima-red)" }}>
                      {selected.officerDecision === "Approved" ? "✅ Loan Approved" : "❌ Loan Declined"}
                    </p>
                    {selected.officerNote && <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>{selected.officerNote}</p>}
                    {selected.decidedAt && <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{new Date(selected.decidedAt).toLocaleString("en-KE")}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;