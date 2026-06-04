import { useState } from "react";
import { runScoutAgent, runGuardianAgent, runHunterAgent } from "../utils/groq";
import { FileText, Brain, CheckCircle, AlertCircle, Loader2, ChevronRight, RotateCcw } from "lucide-react";

const initialForm = {
  fullName: "",
  gender: "",
  occupation: "",
  monthlyIncome: "",
  monthlyExpenses: "",
  savings: "",
  dependants: "",
  loanAmount: "",
  loanPurpose: "",
  repaymentPeriod: "",
  mobileMoneyTx: "",
  previousDefault: "No",
  consentGiven: false,
};

const LoanApplication = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState("");
  const [results, setResults] = useState({ scout: null, guardian: null, hunter: null });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!form.consentGiven) { setError("Please provide consent to proceed."); return; }
    setError("");
    setLoading(true);
    setStep(3);
    try {
      setCurrentAgent("scout");
      const scoutResult = await runScoutAgent(form);
      setResults((prev) => ({ ...prev, scout: scoutResult }));

      setCurrentAgent("guardian");
      const guardianResult = await runGuardianAgent(form);
      setResults((prev) => ({ ...prev, guardian: guardianResult }));

      setCurrentAgent("hunter");
      const hunterResult = await runHunterAgent(form, guardianResult);
      setResults((prev) => ({ ...prev, hunter: hunterResult }));

      const applications = JSON.parse(localStorage.getItem("ujima_applications") || "[]");
      applications.push({
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        member: form,
        results: { scout: scoutResult, guardian: guardianResult, hunter: hunterResult },
        officerDecision: null,
      });
      localStorage.setItem("ujima_applications", JSON.stringify(applications));
      setCurrentAgent("done");
    } catch (err) {
      setError("Agent error: " + err.message);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setStep(1);
    setResults({ scout: null, guardian: null, hunter: null });
    setError("");
    setCurrentAgent("");
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "var(--ujima-blue)",
  };

  const AgentStatus = ({ name, label, emoji, color, result }) => {
    const isActive = currentAgent === name;
    const isDone = result !== null;
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "12px", padding: "16px",
        borderRadius: "12px", border: `2px solid ${isDone ? "#86EFAC" : isActive ? "#FDE68A" : "#E2E8F0"}`,
        backgroundColor: isDone ? "#F0FDF4" : isActive ? "#FFFBEB" : "white",
        transition: "all 0.3s",
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "20px",
          backgroundColor: isDone ? "var(--ujima-green)" : isActive ? color : "#E2E8F0",
        }}>
          {isDone ? "✓" : isActive ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "white" }} /> : emoji}
        </div>
        <div>
          <p style={{ fontWeight: "700", fontSize: "14px", color: "var(--ujima-blue)" }}>{label}</p>
          <p style={{ fontSize: "12px", color: "#94A3B8" }}>
            {isDone ? "Complete ✓" : isActive ? "Processing..." : "Waiting"}
          </p>
        </div>
      </div>
    );
  };

  const ResultCard = ({ title, emoji, color, content }) => (
    <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden", borderLeft: `4px solid ${color}` }}>
      <div style={{ padding: "16px 20px", backgroundColor: color, display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "20px" }}>{emoji}</span>
        <h3 style={{ fontWeight: "700", color: "white", fontSize: "15px" }}>{title}</h3>
      </div>
      <div style={{ padding: "20px" }}>
        <pre style={{ fontSize: "13px", color: "#374151", whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.6" }}>
          {content}
        </pre>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--ujima-blue)", color: "white", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
          <FileText size={12} /> LOAN APPLICATION
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ujima-blue)" }}>Apply for a Loan</h1>
        <p style={{ color: "#6B7280", marginTop: "4px" }}>Our three AI agents will assess your application fairly based on your cash flow.</p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
        {[{ n: 1, label: "Personal Info" }, { n: 2, label: "Loan Details" }, { n: 3, label: "AI Assessment" }].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700",
                backgroundColor: step >= s.n ? "var(--ujima-blue)" : "#E2E8F0",
                color: step >= s.n ? "white" : "#94A3B8",
              }}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500", color: step >= s.n ? "var(--ujima-blue)" : "#94A3B8" }}>
                {s.label}
              </span>
            </div>
            {i < 2 && <ChevronRight size={16} style={{ color: "#CBD5E1" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "24px" }}>Personal Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Grace Wanjiku" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                <option value="">Select gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Occupation</label>
              <select name="occupation" value={form.occupation} onChange={handleChange} style={inputStyle}>
                <option value="">Select occupation</option>
                <option>Market Vendor</option>
                <option>Maize Farmer</option>
                <option>Coffee Farmer</option>
                <option>Boda Boda Operator</option>
                <option>Informal Retailer</option>
                <option>Formally Employed</option>
                <option>Small Business Owner</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Number of Dependants</label>
              <input name="dependants" type="number" value={form.dependants} onChange={handleChange} placeholder="e.g. 3" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Income (KES)</label>
              <input name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={handleChange} placeholder="e.g. 25000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Expenses (KES)</label>
              <input name="monthlyExpenses" type="number" value={form.monthlyExpenses} onChange={handleChange} placeholder="e.g. 18000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Total Savings — Last 6 Months (KES)</label>
              <input name="savings" type="number" value={form.savings} onChange={handleChange} placeholder="e.g. 12000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Mobile Money Transactions/Month</label>
              <input name="mobileMoneyTx" type="number" value={form.mobileMoneyTx} onChange={handleChange} placeholder="e.g. 15" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Previous Loan Default?</label>
            <div style={{ display: "flex", gap: "16px" }}>
              {["No", "Yes"].map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                  <input type="radio" name="previousDefault" value={opt} checked={form.previousDefault === opt} onChange={handleChange} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.fullName || !form.occupation || !form.monthlyIncome}
            style={{
              marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "var(--ujima-blue)", color: "white", padding: "12px 32px",
              borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none",
              cursor: !form.fullName || !form.occupation || !form.monthlyIncome ? "not-allowed" : "pointer",
              opacity: !form.fullName || !form.occupation || !form.monthlyIncome ? 0.5 : 1,
              fontFamily: "inherit",
            }}
          >
            Next: Loan Details <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "24px" }}>Loan Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Loan Amount (KES)</label>
              <input name="loanAmount" type="number" value={form.loanAmount} onChange={handleChange} placeholder="e.g. 50000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Repayment Period (Months)</label>
              <select name="repaymentPeriod" value={form.repaymentPeriod} onChange={handleChange} style={inputStyle}>
                <option value="">Select period</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Loan Purpose</label>
              <select name="loanPurpose" value={form.loanPurpose} onChange={handleChange} style={inputStyle}>
                <option value="">Select purpose</option>
                <option>Stock/Inventory Purchase</option>
                <option>School Fees</option>
                <option>Medical Emergency</option>
                <option>Business Expansion</option>
                <option>Farm Inputs</option>
                <option>Equipment Purchase</option>
                <option>Home Improvement</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          {form.monthlyIncome && form.monthlyExpenses && (
            <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", backgroundColor: "var(--ujima-light)", border: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "12px" }}>Financial Summary</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
                {[
                  { label: "Monthly Income", value: `KES ${Number(form.monthlyIncome).toLocaleString()}`, color: "var(--ujima-green)" },
                  { label: "Monthly Expenses", value: `KES ${Number(form.monthlyExpenses).toLocaleString()}`, color: "var(--ujima-red)" },
                  { label: "Net Surplus", value: `KES ${(Number(form.monthlyIncome) - Number(form.monthlyExpenses)).toLocaleString()}`, color: Number(form.monthlyIncome) - Number(form.monthlyExpenses) > 0 ? "var(--ujima-green)" : "var(--ujima-red)" },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontSize: "11px", color: "#6B7280" }}>{item.label}</p>
                    <p style={{ fontWeight: "700", fontSize: "14px", color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consent */}
          <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", border: "2px solid var(--ujima-green)", backgroundColor: "#F0FDF9" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--ujima-green)", marginBottom: "4px" }}>
              🔒 OASIS Data Consent (Kenya Data Protection Act 2022)
            </p>
            <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "12px" }}>
              Your data will be stored within Africa, processed only for this loan assessment, and never shared with external AI systems. Non-essential data deleted after 180 days.
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" name="consentGiven" checked={form.consentGiven} onChange={handleChange} style={{ width: "16px", height: "16px" }} />
              <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ujima-blue)" }}>
                I consent to my data being processed for this loan application
              </span>
            </label>
          </div>

          {error && (
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "8px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
              <AlertCircle size={16} style={{ color: "var(--ujima-red)" }} />
              <p style={{ fontSize: "14px", color: "var(--ujima-red)" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            <button onClick={() => setStep(1)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "2px solid var(--ujima-blue)", backgroundColor: "transparent", color: "var(--ujima-blue)", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.loanAmount || !form.loanPurpose || !form.consentGiven}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)",
                padding: "12px 32px", borderRadius: "12px", fontWeight: "700",
                fontSize: "14px", border: "none", fontFamily: "inherit",
                cursor: !form.loanAmount || !form.loanPurpose || !form.consentGiven ? "not-allowed" : "pointer",
                opacity: !form.loanAmount || !form.loanPurpose || !form.consentGiven ? 0.5 : 1,
              }}
            >
              <Brain size={16} /> Submit to AI Agents
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--ujima-blue)", marginBottom: "16px" }}>AI Agent Assessment</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <AgentStatus name="scout" label="Scout Agent" emoji="🎓" color="var(--ujima-green)" result={results.scout} />
              <AgentStatus name="guardian" label="Guardian Agent" emoji="🛡️" color="var(--ujima-blue)" result={results.guardian} />
              <AgentStatus name="hunter" label="Hunter Agent" emoji="🔗" color="var(--ujima-gold)" result={results.hunter} />
            </div>
          </div>

          {loading && !results.scout && (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "var(--ujima-blue)", margin: "0 auto 16px" }} />
              <p style={{ fontWeight: "600", color: "var(--ujima-blue)" }}>Agents are analyzing your application...</p>
              <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>This takes about 15–20 seconds</p>
            </div>
          )}

          {results.scout && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <ResultCard title="Scout Agent — Financial Literacy Assessment" emoji="🎓" color="var(--ujima-green)" content={results.scout} />
              {results.guardian && <ResultCard title="Guardian Agent — Risk Triage Report" emoji="🛡️" color="var(--ujima-blue)" content={results.guardian} />}
              {results.hunter && <ResultCard title="Hunter Agent — Officer Briefing" emoji="🔗" color="var(--ujima-gold)" content={results.hunter} />}

              {currentAgent === "done" && (
                <div style={{ backgroundColor: "var(--ujima-green)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                  <p style={{ color: "white", fontWeight: "700", fontSize: "18px", marginBottom: "4px" }}>✅ Assessment Complete</p>
                  <p style={{ color: "#A7F3D0", fontSize: "14px", marginBottom: "16px" }}>
                    Your application has been saved and is awaiting officer review. Final decision rests with a human loan officer.
                  </p>
                  <button onClick={resetForm} style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "white", color: "var(--ujima-green)", padding: "10px 24px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    <RotateCcw size={15} /> Submit Another Application
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanApplication;