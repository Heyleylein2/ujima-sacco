import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const COLORS = ["#1B998B", "#0A2463", "#F4A61D", "#E84855", "#6366F1", "#EC4899"];

const BiasAudit = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ujima_applications") || "[]");
    setApplications(stored);
  }, []);

  // Sample data for demo when no applications exist
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

  // By Occupation
  const occupations = [...new Set(data.map((a) => a.member.occupation))];
  const byOccupation = occupations.map((occ) => {
    const group = data.filter((a) => a.member.occupation === occ);
    const approved = group.filter((a) => a.officerDecision === "Approved").length;
    const total = group.filter((a) => a.officerDecision).length;
    return {
      name: occ.length > 15 ? occ.slice(0, 14) + "…" : occ,
      fullName: occ,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      total: group.length,
    };
  });

  // By Gender
  const byGender = ["Female", "Male", "Prefer not to say"].map((gender) => {
    const group = data.filter((a) => a.member.gender === gender);
    const approved = group.filter((a) => a.officerDecision === "Approved").length;
    const total = group.filter((a) => a.officerDecision).length;
    return {
      name: gender,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      count: group.length,
    };
  }).filter((g) => g.count > 0);

  // Risk Distribution
  const riskDist = ["LOW", "MEDIUM", "HIGH"].map((level) => ({
    name: `${level} RISK`,
    value: data.filter((a) => a.results?.guardian?.includes(level)).length,
  })).filter((r) => r.value > 0);

  // Decision Breakdown
  const decisionData = [
    { name: "Approved", value: data.filter((a) => a.officerDecision === "Approved").length },
    { name: "Declined", value: data.filter((a) => a.officerDecision === "Declined").length },
    { name: "Pending", value: data.filter((a) => !a.officerDecision).length },
  ].filter((d) => d.value > 0);

  // TRACK Framework checks
  const femaleApprovalRate = () => {
    const females = data.filter((a) => a.member.gender === "Female" && a.officerDecision);
    const approved = females.filter((a) => a.officerDecision === "Approved").length;
    return females.length > 0 ? Math.round((approved / females.length) * 100) : 0;
  };

  const maleApprovalRate = () => {
    const males = data.filter((a) => a.member.gender === "Male" && a.officerDecision);
    const approved = males.filter((a) => a.officerDecision === "Approved").length;
    return males.length > 0 ? Math.round((approved / males.length) * 100) : 0;
  };

  const genderGap = Math.abs(femaleApprovalRate() - maleApprovalRate());
  const killSwitchTriggered = genderGap > 20;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{ backgroundColor: "var(--ujima-blue)", color: "white" }}
        >
          <BarChart3 size={12} /> TRACK BIAS AUDIT FRAMEWORK
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: "var(--ujima-blue)" }}>
          Bias Audit Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Continuously monitoring lending decisions for fairness across gender, occupation, and region.
        </p>
        {applications.length === 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertTriangle size={14} className="text-yellow-500" />
            <p className="text-xs text-yellow-700 font-medium">
              Showing sample data — submit loan applications to see real analytics
            </p>
          </div>
        )}
      </div>

      {/* TRACK Kill Switch Alert */}
      {killSwitchTriggered && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center gap-3 border-2"
          style={{ borderColor: "var(--ujima-red)", backgroundColor: "#FEF2F2" }}
        >
          <AlertTriangle size={24} style={{ color: "var(--ujima-red)" }} />
          <div>
            <p className="font-bold" style={{ color: "var(--ujima-red)" }}>
              ⚠️ TRACK Kill Switch Triggered
            </p>
            <p className="text-sm text-red-600">
              Gender approval gap is {genderGap}% (threshold: 20%). Human review required immediately.
            </p>
          </div>
        </div>
      )}

      {/* TRACK Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Female Approval Rate",
            value: `${femaleApprovalRate()}%`,
            color: "var(--ujima-green)",
            icon: <TrendingUp size={18} />,
          },
          {
            label: "Gender Gap",
            value: `${genderGap}%`,
            color: genderGap > 20 ? "var(--ujima-red)" : "var(--ujima-green)",
            icon: genderGap > 20
              ? <AlertTriangle size={18} />
              : <CheckCircle size={18} />,
          },
          {
            label: "Total Reviewed",
            value: data.filter((a) => a.officerDecision).length,
            color: "var(--ujima-blue)",
            icon: <Shield size={18} />,
          },
          {
            label: "Kill Switch",
            value: killSwitchTriggered ? "ACTIVE" : "NORMAL",
            color: killSwitchTriggered ? "var(--ujima-red)" : "var(--ujima-green)",
            icon: killSwitchTriggered
              ? <AlertTriangle size={18} />
              : <CheckCircle size={18} />,
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* Approval Rate by Occupation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-1" style={{ color: "var(--ujima-blue)" }}>
            Approval Rate by Occupation
          </h3>
          <p className="text-xs text-gray-400 mb-4">TRACK — Representation check</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byOccupation} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                formatter={(val, _, props) => [`${val}%`, props.payload.fullName]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="approvalRate" fill="var(--ujima-blue)" radius={[4, 4, 0, 0]}
                label={{ position: "top", fontSize: 10, formatter: (v) => `${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Approval Rate by Gender */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-1" style={{ color: "var(--ujima-blue)" }}>
            Approval Rate by Gender
          </h3>
          <p className="text-xs text-gray-400 mb-4">TRACK — Amplification check</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byGender} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                formatter={(val) => [`${val}%`, "Approval Rate"]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="approvalRate" radius={[4, 4, 0, 0]}
                label={{ position: "top", fontSize: 11, formatter: (v) => `${v}%` }}
              >
                {byGender.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-1" style={{ color: "var(--ujima-blue)" }}>
            Risk Distribution
          </h3>
          <p className="text-xs text-gray-400 mb-4">Guardian Agent risk assessments</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDist} cx="50%" cy="50%" outerRadius={80}
                dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {riskDist.map((_, index) => (
                  <Cell key={index} fill={
                    index === 0 ? "var(--ujima-green)"
                    : index === 1 ? "var(--ujima-gold)"
                    : "var(--ujima-red)"
                  } />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Decision Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-1" style={{ color: "var(--ujima-blue)" }}>
            Decision Breakdown
          </h3>
          <p className="text-xs text-gray-400 mb-4">Officer final decisions</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={decisionData} cx="50%" cy="50%" innerRadius={50}
                outerRadius={80} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {decisionData.map((entry, index) => (
                  <Cell key={index} fill={
                    entry.name === "Approved" ? "var(--ujima-green)"
                    : entry.name === "Declined" ? "var(--ujima-red)"
                    : "var(--ujima-gold)"
                  } />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRACK Framework Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold mb-4" style={{ color: "var(--ujima-blue)" }}>
          TRACK Framework Compliance
        </h3>
        <div className="grid md:grid-cols-5 gap-3">
          {[
            { letter: "T", name: "Training Data", status: "Monitor", color: "var(--ujima-gold)" },
            { letter: "R", name: "Representation", status: "Active", color: "var(--ujima-green)" },
            { letter: "A", name: "Amplification", status: "Active", color: "var(--ujima-green)" },
            { letter: "C", name: "Counterfactuals", status: "Active", color: "var(--ujima-green)" },
            { letter: "K", name: "Kill Switch", status: killSwitchTriggered ? "TRIGGERED" : "Normal", color: killSwitchTriggered ? "var(--ujima-red)" : "var(--ujima-green)" },
          ].map((item) => (
            <div
              key={item.letter}
              className="p-4 rounded-xl text-center border-2"
              style={{ borderColor: item.color, backgroundColor: `${item.color}10` }}
            >
              <p className="text-2xl font-extrabold mono mb-1" style={{ color: item.color }}>
                {item.letter}
              </p>
              <p className="text-xs font-bold" style={{ color: "var(--ujima-blue)" }}>
                {item.name}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: item.color }}>
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiasAudit;