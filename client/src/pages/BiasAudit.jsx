import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp, Shield } from "lucide-react";

const BiasAudit = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ujima_applications") || "[]");
    setApplications(stored);
  }, []);

  const sampleData = [
    { id: 1, member: { occupation: "Market Vendor", gender: "Female", monthlyIncome: 22000 }, officerDecision: "Approved", results: { guardian: "RISK LEVEL: LOW" } },
    { id: 2, member: { occupation: "Formally Employed", gender: "Male", monthlyIncome: 55000 }, officerDecision: "Approved", results: { guardian: "RISK LEVEL: LOW" } },
    { id: 3, member: { occupation: "Maize Farmer", gender: "Female", monthlyIncome: 18000 }, officerDecision: "Approved", results: { guardian: "RISK LEVEL: MEDIUM" } },
    { id: 4, member: { occupation: "Market Vendor", gender: "Female", monthlyIncome: 15000 }, officerDecision: "Declined", results: { guardian: "RISK LEVEL: HIGH" } },
    { id: 5, member: { occupation: "Boda Boda Operator", gender: "Male", monthlyIncome: 25000 }, officerDecision: "Approved", results: { guardian: "RISK LEVEL: MEDIUM" } },
    { id: 6, member: { occupation: "Formally Employed", gender: "Female", monthlyIncome: 60000 }, officerDecision: "Approved", results: { guardian: "RISK LEVEL: LOW" } },
    { id: 7, member: { occupation: "Informal Retailer", gender: "Female", monthlyIncome: 20000 }, officerDecision: null, results: { guardian: "RISK LEVEL: MEDIUM" } },
    { id: 8, member: { occupation: "Coffee Farmer", gender: "Male", monthlyIncome: 30000 }, officerDecision: "Approved", results: { guardian: "RISK LEVEL: LOW" } },
  ];

  const data = applications.length > 0 ? applications : sampleData;

  const occupations = [...new Set(data.map((a) => a.member.occupation))];
  const byOccupation = occupations.map((occ) => {
    const group = data.filter((a) => a.member.occupation === occ);
    const approved = group.filter((a) => a.officerDecision === "Approved").length;
    const total = group.filter((a) => a.officerDecision).length;
    return { name: occ.length > 14 ? occ.slice(0, 13) + "…" : occ, fullName: occ, approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0, total: group.length };
  });

  const byGender = ["Female", "Male"].map((gender) => {
    const group = data.filter((a) => a.member.gender === gender);
    const approved = group.filter((a) => a.officerDecision === "Approved").length;
    const total = group.filter((a) => a.officerDecision).length;
    return { name: gender, approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0, count: group.length };
  }).filter((g) => g.count > 0);

  const riskDist = ["LOW", "MEDIUM", "HIGH"].map((level) => ({
    name: `${level} RISK`,
    value: data.filter((a) => a.results?.guardian?.includes(level)).length,
  })).filter((r) => r.value > 0);

  const decisionData = [
    { name: "Approved", value: data.filter((a) => a.officerDecision === "Approved").length },
    { name: "Declined", value: data.filter((a) => a.officerDecision === "Declined").length },
    { name: "Pending", value: data.filter((a) => !a.officerDecision).length },
  ].filter((d) => d.value > 0);

  const femaleRate = () => {
    const f = data.filter((a) => a.member.gender === "Female" && a.officerDecision);
    return f.length > 0 ? Math.round((f.filter((a) => a.officerDecision === "Approved").length / f.length) * 100) : 0;
  };

  const maleRate = () => {
    const m = data.filter((a) => a.member.gender === "Male" && a.officerDecision);
    return m.length > 0 ? Math.round((m.filter((a) => a.officerDecision === "Approved").length / m.length) * 100) : 0;
  };

  const genderGap = Math.abs(femaleRate() - maleRate());
  const killSwitch = genderGap > 20;
  const COLORS = ["var(--ujima-green)", "var(--ujima-blue)", "var(--ujima-gold)", "var(--ujima-red)"];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--ujima-blue)", color: "white", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
          <BarChart3 size={12} /> TRACK BIAS AUDIT FRAMEWORK
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ujima-blue)" }}>Bias Audit Dashboard</h1>
        <p style={{ color: "#6B7280", marginTop: "4px" }}>Continuously monitoring lending decisions for fairness across gender, occupation, and region.</p>
        {applications.length === 0 && (
          <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
            <p style={{ fontSize: "12px", color: "#92400E", fontWeight: "500" }}>Showing sample data — submit loan applications to see real analytics</p>
          </div>
        )}
      </div>

      {/* Kill Switch Alert */}
      {killSwitch && (
        <div style={{ marginBottom: "24px", padding: "16px", borderRadius: "12px", border: "2px solid var(--ujima-red)", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", gap: "12px" }}>
          <AlertTriangle size={24} style={{ color: "var(--ujima-red)" }} />
          <div>
            <p style={{ fontWeight: "700", color: "var(--ujima-red)" }}>⚠️ TRACK Kill Switch Triggered</p>
            <p style={{ fontSize: "14px", color: "#DC2626" }}>Gender approval gap is {genderGap}% (threshold: 20%). Human review required immediately.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Female Approval Rate", value: `${femaleRate()}%`, color: "var(--ujima-green)" },
          { label: "Gender Gap", value: `${genderGap}%`, color: genderGap > 20 ? "var(--ujima-red)" : "var(--ujima-green)" },
          { label: "Total Reviewed", value: data.filter((a) => a.officerDecision).length, color: "var(--ujima-blue)" },
          { label: "Kill Switch", value: killSwitch ? "ACTIVE" : "NORMAL", color: killSwitch ? "var(--ujima-red)" : "var(--ujima-green)" },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "12px", color: "#6B7280", fontWeight: "500", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "4px" }}>Approval Rate by Occupation</h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>TRACK — Representation check</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byOccupation} margin={{ top: 5, right: 10, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip formatter={(val, _, p) => [`${val}%`, p.payload.fullName]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="approvalRate" fill="var(--ujima-blue)" radius={[4, 4, 0, 0]} label={{ position: "top", fontSize: 10, formatter: (v) => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "4px" }}>Approval Rate by Gender</h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>TRACK — Amplification check</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byGender} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip formatter={(val) => [`${val}%`, "Approval Rate"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="approvalRate" radius={[4, 4, 0, 0]} label={{ position: "top", fontSize: 12, formatter: (v) => `${v}%` }}>
                {byGender.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "4px" }}>Risk Distribution</h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>Guardian Agent risk assessments</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {riskDist.map((_, i) => <Cell key={i} fill={i === 0 ? "var(--ujima-green)" : i === 1 ? "var(--ujima-gold)" : "var(--ujima-red)"} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "4px" }}>Decision Breakdown</h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>Officer final decisions</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={decisionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {decisionData.map((entry, i) => <Cell key={i} fill={entry.name === "Approved" ? "var(--ujima-green)" : entry.name === "Declined" ? "var(--ujima-red)" : "var(--ujima-gold)"} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRACK Framework */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h3 style={{ fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "16px" }}>TRACK Framework Compliance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {[
            { letter: "T", name: "Training Data", status: "Monitor", color: "var(--ujima-gold)" },
            { letter: "R", name: "Representation", status: "Active", color: "var(--ujima-green)" },
            { letter: "A", name: "Amplification", status: "Active", color: "var(--ujima-green)" },
            { letter: "C", name: "Counterfactuals", status: "Active", color: "var(--ujima-green)" },
            { letter: "K", name: "Kill Switch", status: killSwitch ? "TRIGGERED" : "Normal", color: killSwitch ? "var(--ujima-red)" : "var(--ujima-green)" },
          ].map((item) => (
            <div key={item.letter} style={{ padding: "16px", borderRadius: "12px", textAlign: "center", border: `2px solid ${item.color}`, backgroundColor: `${item.color}15` }}>
              <p style={{ fontSize: "28px", fontWeight: "800", fontFamily: "monospace", color: item.color, marginBottom: "4px" }}>{item.letter}</p>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--ujima-blue)" }}>{item.name}</p>
              <p style={{ fontSize: "11px", fontWeight: "600", color: item.color, marginTop: "4px" }}>{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiasAudit;