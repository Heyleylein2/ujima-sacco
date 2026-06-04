import { useState } from "react";
import { runScoutAgent, runGuardianAgent, runHunterAgent } from "../utils/groq";
import { FileText, Brain, Shield, Link2, CheckCircle, AlertCircle, Loader2, ChevronRight, RotateCcw } from "lucide-react";

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
  const [results, setResults] = useState({
    scout: null,
    guardian: null,
    hunter: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.consentGiven) {
      setError("Please provide consent to proceed.");
      return;
    }
    setError("");
    setLoading(true);
    setStep(3);

    try {
      // Scout Agent
      setCurrentAgent("scout");
      const scoutResult = await runScoutAgent(form);
      setResults((prev) => ({ ...prev, scout: scoutResult }));

      // Guardian Agent
      setCurrentAgent("guardian");
      const guardianResult = await runGuardianAgent(form);
      setResults((prev) => ({ ...prev, guardian: guardianResult }));

      // Hunter Agent
      setCurrentAgent("hunter");
      const hunterResult = await runHunterAgent(form, guardianResult);
      setResults((prev) => ({ ...prev, hunter: hunterResult }));

      // Save to localStorage
      const applications = JSON.parse(localStorage.getItem("ujima_applications") || "[]");
      applications.push({
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        member: form,
        results: {
          scout: scoutResult,
          guardian: guardianResult,
          hunter: hunterResult,
        },
        officerDecision: null,
      });
      localStorage.setItem("ujima_applications", JSON.stringify(applications));

      setCurrentAgent("done");
    } catch (err) {
      setError("Agent error: " + err.message);
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

  const AgentStatus = ({ name, label, icon, color, result }) => {
    const isActive = currentAgent === name;
    const isDone = result !== null;
    return (
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-500 ${
          isDone
            ? "border-green-300 bg-green-50"
            : isActive
            ? "border-yellow-300 bg-yellow-50 pulse-gold"
            : "border-gray-200 bg-white"
        }`}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: isDone ? "#1B998B" : isActive ? color : "#CBD5E1" }}
        >
          {isDone ? <CheckCircle size={20} /> : isActive ? <Loader2 size={20} className="animate-spin" /> : icon}
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--ujima-blue)" }}>{label}</p>
          <p className="text-xs text-gray-500">
            {isDone ? "Complete ✓" : isActive ? "Processing..." : "Waiting"}
          </p>
        </div>
      </div>
    );
  };

  const ResultCard = ({ title, icon, color, content, emoji }) => (
    <div className="bg-white rounded-xl shadow-sm border-l-4 overflow-hidden" style={{ borderColor: color }}>
      <div className="px-5 py-4 flex items-center gap-2" style={{ backgroundColor: color }}>
        <span className="text-xl">{emoji}</span>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="p-5">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass = "block text-sm font-semibold mb-1.5";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{ backgroundColor: "var(--ujima-blue)", color: "white" }}
        >
          <FileText size={12} /> LOAN APPLICATION
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: "var(--ujima-blue)" }}>
          Apply for a Loan
        </h1>
        <p className="text-gray-500 mt-1">
          Our three AI agents will assess your application fairly based on your cash flow.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Personal Info" },
          { n: 2, label: "Loan Details" },
          { n: 3, label: "AI Assessment" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  backgroundColor: step >= s.n ? "var(--ujima-blue)" : "#E2E8F0",
                  color: step >= s.n ? "white" : "#94A3B8",
                }}
              >
                {step > s.n ? <CheckCircle size={16} /> : s.n}
              </div>
              <span
                className="text-sm font-medium hidden md:inline"
                style={{ color: step >= s.n ? "var(--ujima-blue)" : "#94A3B8" }}
              >
                {s.label}
              </span>
            </div>
            {i < 2 && <ChevronRight size={16} className="text-gray-300" />}
          </div>
        ))}
      </div>

      {/* STEP 1 — Personal Info */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 fade-in-up">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--ujima-blue)" }}>
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="e.g. Grace Wanjiku" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Occupation</label>
              <select name="occupation" value={form.occupation} onChange={handleChange} className={inputClass}>
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
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Number of Dependants</label>
              <input name="dependants" type="number" value={form.dependants} onChange={handleChange}
                placeholder="e.g. 3" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Monthly Income (KES)</label>
              <input name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={handleChange}
                placeholder="e.g. 25000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Monthly Expenses (KES)</label>
              <input name="monthlyExpenses" type="number" value={form.monthlyExpenses} onChange={handleChange}
                placeholder="e.g. 18000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Total Savings — Last 6 Months (KES)</label>
              <input name="savings" type="number" value={form.savings} onChange={handleChange}
                placeholder="e.g. 12000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Mobile Money Transactions/Month</label>
              <input name="mobileMoneyTx" type="number" value={form.mobileMoneyTx} onChange={handleChange}
                placeholder="e.g. 15" className={inputClass} />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Previous Loan Default?</label>
            <div className="flex gap-4">
              {["No", "Yes"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="previousDefault" value={opt}
                    checked={form.previousDefault === opt} onChange={handleChange} />
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.fullName || !form.occupation || !form.monthlyIncome}
            className="mt-8 flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ backgroundColor: "var(--ujima-blue)", color: "white" }}
          >
            Next: Loan Details <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2 — Loan Details */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 fade-in-up">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--ujima-blue)" }}>
            Loan Details
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Loan Amount (KES)</label>
              <input name="loanAmount" type="number" value={form.loanAmount} onChange={handleChange}
                placeholder="e.g. 50000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Repayment Period (Months)</label>
              <select name="repaymentPeriod" value={form.repaymentPeriod} onChange={handleChange} className={inputClass}>
                <option value="">Select period</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} style={{ color: "var(--ujima-blue)" }}>Loan Purpose</label>
              <select name="loanPurpose" value={form.loanPurpose} onChange={handleChange} className={inputClass}>
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

          {/* Summary Card */}
          {form.monthlyIncome && form.monthlyExpenses && (
            <div
              className="mt-6 p-4 rounded-xl"
              style={{ backgroundColor: "var(--ujima-light)", border: "1px solid #E2E8F0" }}
            >
              <p className="text-sm font-bold mb-2" style={{ color: "var(--ujima-blue)" }}>
                Financial Summary
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500">Monthly Income</p>
                  <p className="font-bold text-sm" style={{ color: "var(--ujima-green)" }}>
                    KES {Number(form.monthlyIncome).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Expenses</p>
                  <p className="font-bold text-sm" style={{ color: "var(--ujima-red)" }}>
                    KES {Number(form.monthlyExpenses).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Surplus</p>
                  <p
                    className="font-bold text-sm"
                    style={{
                      color:
                        form.monthlyIncome - form.monthlyExpenses > 0
                          ? "var(--ujima-green)"
                          : "var(--ujima-red)",
                    }}
                  >
                    KES {(form.monthlyIncome - form.monthlyExpenses).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OASIS Consent */}
          <div
            className="mt-6 p-4 rounded-xl border-2"
            style={{ borderColor: "var(--ujima-green)", backgroundColor: "#F0FDF9" }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: "var(--ujima-green)" }}>
              🔒 OASIS Data Consent (Kenya Data Protection Act 2022)
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Your data will be stored within Africa, processed only for this loan assessment,
              and never shared with external AI systems. Non-essential data deleted after 180 days.
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="consentGiven" checked={form.consentGiven}
                onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm font-medium" style={{ color: "var(--ujima-blue)" }}>
                I consent to my data being processed for this loan application
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--ujima-blue)", color: "var(--ujima-blue)" }}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.loanAmount || !form.loanPurpose || !form.consentGiven}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)" }}
            >
              <Brain size={16} /> Submit to AI Agents
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — AI Assessment */}
      {step === 3 && (
        <div className="fade-in-up">

          {/* Agent Progress */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ujima-blue)" }}>
              AI Agent Assessment
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              <AgentStatus name="scout" label="Scout Agent" icon="🎓"
                color="var(--ujima-green)" result={results.scout} />
              <AgentStatus name="guardian" label="Guardian Agent" icon="🛡️"
                color="var(--ujima-blue)" result={results.guardian} />
              <AgentStatus name="hunter" label="Hunter Agent" icon="🔗"
                color="var(--ujima-gold)" result={results.hunter} />
            </div>
          </div>

          {/* Results */}
          {results.scout && (
            <div className="space-y-5 fade-in-up">
              <ResultCard
                title="Scout Agent — Financial Literacy Assessment"
                emoji="🎓"
                color="var(--ujima-green)"
                content={results.scout}
              />
              {results.guardian && (
                <ResultCard
                  title="Guardian Agent — Risk Triage Report"
                  emoji="🛡️"
                  color="var(--ujima-blue)"
                  content={results.guardian}
                />
              )}
              {results.hunter && (
                <ResultCard
                  title="Hunter Agent — Officer Briefing"
                  emoji="🔗"
                  color="var(--ujima-gold)"
                  content={results.hunter}
                />
              )}

              {currentAgent === "done" && (
                <div
                  className="p-5 rounded-xl text-center fade-in-up"
                  style={{ backgroundColor: "var(--ujima-green)" }}
                >
                  <p className="text-white font-bold text-lg mb-1">
                    ✅ Assessment Complete
                  </p>
                  <p className="text-green-100 text-sm mb-4">
                    Your application has been saved and is awaiting officer review.
                    Final decision rests with a human loan officer.
                  </p>
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm bg-white mx-auto hover:bg-green-50 transition-colors"
                    style={{ color: "var(--ujima-green)" }}
                  >
                    <RotateCcw size={15} /> Submit Another Application
                  </button>
                </div>
              )}
            </div>
          )}

          {loading && !results.scout && (
            <div className="text-center py-16">
              <Loader2 size={40} className="animate-spin mx-auto mb-4"
                style={{ color: "var(--ujima-blue)" }} />
              <p className="font-semibold" style={{ color: "var(--ujima-blue)" }}>
                Agents are analyzing your application...
              </p>
              <p className="text-sm text-gray-500 mt-1">This takes about 15-20 seconds</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanApplication;