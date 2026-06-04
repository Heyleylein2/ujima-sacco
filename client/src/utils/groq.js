const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const callGroq = async (messages, model = "llama-3.3-70b-versatile") => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Groq API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const runScoutAgent = async (memberData) => {
  const messages = [
    {
      role: "system",
      content: `You are Scout, a compassionate financial literacy coach for Ujima SACCO in Kenya.
      Your role is to educate informal traders, market vendors, and farmers about loan eligibility.
      Always respond warmly and encouragingly. Use simple language.
      Structure your response with:
      1. Greeting using their name
      2. Financial Health Assessment (2-3 sentences)
      3. Strengths (bullet points)
      4. Areas to Improve (bullet points)
      5. Readiness Score out of 100
      6. Encouragement message
      Keep response under 300 words.`,
    },
    {
      role: "user",
      content: `Member Profile:
      Name: ${memberData.fullName}
      Occupation: ${memberData.occupation}
      Monthly Income: KES ${memberData.monthlyIncome}
      Monthly Expenses: KES ${memberData.monthlyExpenses}
      Savings (last 6 months): KES ${memberData.savings}
      Dependants: ${memberData.dependants}
      Loan Amount Requested: KES ${memberData.loanAmount}
      Loan Purpose: ${memberData.loanPurpose}
      Mobile Money Transactions/Month: ${memberData.mobileMoneyTx}
      Previous Loan Default: ${memberData.previousDefault}`,
    },
  ];
  return await callGroq(messages);
};

export const runGuardianAgent = async (memberData) => {
  const messages = [
    {
      role: "system",
      content: `You are Guardian, an ethical AI loan risk assessment agent for Ujima SACCO in Kenya.
      Evaluate loan applications from informal traders, market vendors, and farmers.
      Assess based on cash flow and repayment capacity — NOT occupation labels.
      Actively work against bias toward informal sector workers.
      Structure your response as:
      1. RISK LEVEL: (LOW / MEDIUM / HIGH)
      2. RECOMMENDATION: (APPROVE / CONDITIONAL APPROVE / ESCALATE TO OFFICER / DECLINE)
      3. Risk Score: X/100 (lower = less risk)
      4. Key Factors (3-4 bullet points)
      5. Repayment Capacity Analysis
      6. Suggested Loan Terms (if approving)
      7. Conditions (if any)
      Keep response under 350 words.`,
    },
    {
      role: "user",
      content: `Loan Application:
      Applicant: ${memberData.fullName}
      Occupation: ${memberData.occupation}
      Monthly Income: KES ${memberData.monthlyIncome}
      Monthly Expenses: KES ${memberData.monthlyExpenses}
      Net Monthly Surplus: KES ${memberData.monthlyIncome - memberData.monthlyExpenses}
      Savings: KES ${memberData.savings}
      Dependants: ${memberData.dependants}
      Requested Amount: KES ${memberData.loanAmount}
      Loan Purpose: ${memberData.loanPurpose}
      Repayment Period: ${memberData.repaymentPeriod} months
      Mobile Money Transactions/Month: ${memberData.mobileMoneyTx}
      Previous Default: ${memberData.previousDefault}
      Gender: ${memberData.gender}`,
    },
  ];
  return await callGroq(messages);
};

export const runHunterAgent = async (memberData, guardianResult) => {
  const messages = [
    {
      role: "system",
      content: `You are Hunter, the human coordination agent for Ujima SACCO.
      Prepare a clear briefing for the loan officer who makes the final decision.
      Structure your response as:
      1. OFFICER BRIEFING SUMMARY (2-3 sentences)
      2. AI RECOMMENDATION SUMMARY
      3. FLAGS FOR HUMAN REVIEW
      4. SUGGESTED NEXT STEPS (numbered list)
      5. DOCUMENTS TO REQUEST FROM MEMBER
      6. PRIORITY LEVEL: (URGENT / NORMAL / LOW)
      Keep response under 300 words.`,
    },
    {
      role: "user",
      content: `Member: ${memberData.fullName}
      Occupation: ${memberData.occupation}
      Loan Amount: KES ${memberData.loanAmount}
      Purpose: ${memberData.loanPurpose}
      Dependants: ${memberData.dependants}
      Guardian Assessment: ${guardianResult}`,
    },
  ];
  return await callGroq(messages, "llama-3.1-8b-instant");
};