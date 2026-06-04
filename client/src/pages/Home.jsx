import { Link } from "react-router-dom";
import { FileText, LayoutDashboard, BarChart3, Zap, Users } from "lucide-react";

const Home = () => {
  const agents = [
    {
      name: "Scout Agent",
      role: "Financial Literacy Coach",
      description: "Educates members and assesses loan readiness before application.",
      color: "var(--ujima-green)",
      icon: "🎓",
    },
    {
      name: "Guardian Agent",
      role: "Loan Risk Triage",
      description: "Evaluates applications based on cash flow, not occupation labels.",
      color: "var(--ujima-blue)",
      icon: "🛡️",
    },
    {
      name: "Hunter Agent",
      role: "Human Coordination",
      description: "Prepares officer briefings and flags cases needing human review.",
      color: "var(--ujima-gold)",
      icon: "🔗",
    },
  ];

  const stats = [
    { label: "Vendor Rejection Rate (Before)", value: "68%", color: "var(--ujima-red)" },
    { label: "Target Approval Increase", value: "+37%", color: "var(--ujima-green)" },
    { label: "Max Default Risk", value: "<3%", color: "var(--ujima-gold)" },
    { label: "Processing Time Reduction", value: "65%", color: "var(--ujima-blue)" },
  ];

  const frameworks = [
    { name: "ETHOS", desc: "Dignity-Centred Loan Approval" },
    { name: "TRACK", desc: "Bias Audit Framework" },
    { name: "OASIS", desc: "Data Stewardship Charter" },
    { name: "PRIDE", desc: "Human Oversight Framework" },
    { name: "HORIZON", desc: "Future Scaling Roadmap" },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 16px" }}>

      {/* Hero */}
      <div style={{ backgroundColor: "var(--ujima-blue)", borderRadius: "16px", padding: "60px 40px", marginBottom: "40px", color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "16px" }}>
            <Zap size={12} /> AI-POWERED LENDING ECOSYSTEM
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "800", lineHeight: 1.2, marginBottom: "16px" }}>
            Fair Lending for Every<br />
            <span style={{ color: "var(--ujima-gold)" }}>Kenyan Entrepreneur</span>
          </h1>
          <p style={{ color: "#93C5FD", fontSize: "18px", maxWidth: "600px", marginBottom: "32px" }}>
            Ujima SACCO's AI system gives market vendors, farmers, and informal traders
            equal access to credit — evaluated on cash flow, not occupation labels.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/apply" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
              <FileText size={16} /> Apply for a Loan
            </Link>
            <Link to="/officer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
              <LayoutDashboard size={16} /> Officer Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "32px", fontWeight: "800", color: stat.color, marginBottom: "4px" }}>{stat.value}</p>
            <p style={{ fontSize: "12px", color: "#6B7280", fontWeight: "500" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Agents */}
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ujima-blue)", marginBottom: "20px" }}>
        Three-Agent AI System
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {agents.map((agent) => (
          <div key={agent.name} style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderTop: `4px solid ${agent.color}` }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{agent.icon}</div>
            <h3 style={{ fontWeight: "700", fontSize: "18px", color: "var(--ujima-blue)", marginBottom: "4px" }}>{agent.name}</h3>
            <p style={{ fontSize: "12px", fontWeight: "600", color: agent.color, marginBottom: "8px" }}>{agent.role}</p>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>{agent.description}</p>
          </div>
        ))}
      </div>

      {/* Frameworks */}
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ujima-blue)", marginBottom: "20px" }}>
        Ethical Architecture
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "40px" }}>
        {frameworks.map((fw) => (
          <div key={fw.name} style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontWeight: "800", fontSize: "18px", color: "var(--ujima-blue)", fontFamily: "monospace" }}>{fw.name}</span>
            <span style={{ fontSize: "14px", color: "#6B7280" }}>{fw.desc}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: "var(--ujima-green)", borderRadius: "12px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ color: "white" }}>
          <p style={{ fontWeight: "700", fontSize: "18px" }}>Ready to review applications?</p>
          <p style={{ color: "#A7F3D0", fontSize: "14px" }}>Access the bias audit dashboard and officer tools</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "white", color: "var(--ujima-green)", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
            <BarChart3 size={15} /> Bias Audit
          </Link>
          <Link to="/officer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
            <Users size={15} /> Officer View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;