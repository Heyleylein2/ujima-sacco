import { useState, useEffect } from "react";
import { LayoutDashboard, CheckCircle, XCircle, Clock, Eye, User, Calendar, DollarSign, AlertTriangle } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{ backgroundColor: "var(--ujima-blue)", color: "white" }}
        >
          <LayoutDashboard size={12} /> OFFICER DASHBOARD
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: "var(--ujima-blue)" }}>
          Loan Officer Review Panel
        </h1>
        <p className="text-gray-500 mt-1">
          Final lending decisions rest with you. AI agents provide recommendations only.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Applications", value: stats.total, color: "var(--ujima-blue)", icon: <LayoutDashboard size={18} /> },
          { label: "Pending Review", value: stats.pending, color: "var(--ujima-gold)", icon: <Clock size={18} /> },
          { label: "Approved", value: stats.approved, color: "var(--ujima-green)", icon: <CheckCircle size={18} /> },
          { label: "Declined", value: stats.declined, color: "var(--ujima-red)", icon: <XCircle size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-6">

        {/* Application List */}
        <div className="md:col-span-2">
          {/* Filter Tabs */}
          <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm">
            {["all", "pending", "approved", "declined"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all"
                style={
                  filter === f
                    ? { backgroundColor: "var(--ujima-blue)", color: "white" }
                    : { color: "#94A3B8" }
                }
              >
                {f}
              </button>
            ))}
          </div>

          {/* Applications */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-gray-400 text-sm">No applications found</p>
                <p className="text-gray-300 text-xs mt-1">
                  Submit a loan application first
                </p>
              </div>
            ) : (
              filtered.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md border-2 ${
                    selected?.id === app.id ? "border-blue-400" : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm" style={{ color: "var(--ujima-blue)" }}>
                        {app.member.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{app.member.occupation}</p>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: app.officerDecision === "Approved"
                          ? "#DCFCE7" : app.officerDecision === "Declined"
                          ? "#FEE2E2" : "#FEF9C3",
                        color: app.officerDecision === "Approved"
                          ? "var(--ujima-green)" : app.officerDecision === "Declined"
                          ? "var(--ujima-red)" : "#92400E",
                      }}
                    >
                      {app.officerDecision || "PENDING"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: "var(--ujima-gold)" }}>
                      KES {Number(app.member.loanAmount).toLocaleString()}
                    </p>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getRiskColor(app.results?.guardian) }}
                    >
                      {getRiskLabel(app.results?.guardian)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(app.submittedAt).toLocaleDateString("en-KE")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="md:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
              <Eye size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-semibold">Select an application to review</p>
              <p className="text-gray-300 text-sm mt-1">Click any application on the left</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

              {/* Member Header */}
              <div className="p-6" style={{ backgroundColor: "var(--ujima-blue)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)" }}
                    >
                      {selected.member.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{selected.member.fullName}</p>
                      <p className="text-blue-200 text-sm">{selected.member.occupation}</p>
                    </div>
                  </div>
                  <span
                    className="text-sm font-bold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: selected.officerDecision === "Approved"
                        ? "var(--ujima-green)" : selected.officerDecision === "Declined"
                        ? "var(--ujima-red)" : "var(--ujima-gold)",
                      color: "white",
                    }}
                  >
                    {selected.officerDecision || "PENDING REVIEW"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Member Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Loan Amount", value: `KES ${Number(selected.member.loanAmount).toLocaleString()}`, icon: <DollarSign size={14} /> },
                    { label: "Purpose", value: selected.member.loanPurpose, icon: <AlertTriangle size={14} /> },
                    { label: "Repayment", value: `${selected.member.repaymentPeriod} months`, icon: <Calendar size={14} /> },
                    { label: "Monthly Income", value: `KES ${Number(selected.member.monthlyIncome).toLocaleString()}`, icon: <DollarSign size={14} /> },
                    { label: "Net Surplus", value: `KES ${(selected.member.monthlyIncome - selected.member.monthlyExpenses).toLocaleString()}`, icon: <DollarSign size={14} /> },
                    { label: "Dependants", value: selected.member.dependants, icon: <User size={14} /> },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg" style={{ backgroundColor: "var(--ujima-light)" }}>
                      <div className="flex items-center gap-1 mb-1" style={{ color: "var(--ujima-blue)" }}>
                        {item.icon}
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                      <p className="font-bold text-sm" style={{ color: "var(--ujima-blue)" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Agent Results */}
                {[
                  { key: "scout", label: "🎓 Scout Agent", color: "var(--ujima-green)" },
                  { key: "guardian", label: "🛡️ Guardian Agent", color: "var(--ujima-blue)" },
                  { key: "hunter", label: "🔗 Hunter Agent", color: "var(--ujima-gold)" },
                ].map((agent) => (
                  <div key={agent.key}>
                    <p className="text-sm font-bold mb-2" style={{ color: agent.color }}>
                      {agent.label}
                    </p>
                    <div
                      className="p-4 rounded-xl text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans"
                      style={{ backgroundColor: "var(--ujima-light)", borderLeft: `3px solid ${agent.color}` }}
                    >
                      {selected.results?.[agent.key] || "No data"}
                    </div>
                  </div>
                ))}

                {/* Officer Decision */}
                {!selected.officerDecision ? (
                  <div
                    className="p-5 rounded-xl border-2"
                    style={{ borderColor: "var(--ujima-gold)", backgroundColor: "#FFFBEB" }}
                  >
                    <p className="font-bold mb-1" style={{ color: "var(--ujima-blue)" }}>
                      Your Decision (PRIDE Framework)
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      AI agents have completed their assessment. Final decision is yours.
                    </p>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add your officer notes here..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-400"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateDecision(selected.id, "Approved")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "var(--ujima-green)" }}
                      >
                        <CheckCircle size={16} /> Approve Loan
                      </button>
                      <button
                        onClick={() => updateDecision(selected.id, "Declined")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "var(--ujima-red)" }}
                      >
                        <XCircle size={16} /> Decline Loan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: selected.officerDecision === "Approved" ? "#DCFCE7" : "#FEE2E2",
                    }}
                  >
                    <p
                      className="font-bold"
                      style={{
                        color: selected.officerDecision === "Approved"
                          ? "var(--ujima-green)" : "var(--ujima-red)",
                      }}
                    >
                      {selected.officerDecision === "Approved" ? "✅ Loan Approved" : "❌ Loan Declined"}
                    </p>
                    {selected.officerNote && (
                      <p className="text-sm text-gray-600 mt-1">{selected.officerNote}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {selected.decidedAt && new Date(selected.decidedAt).toLocaleString("en-KE")}
                    </p>
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