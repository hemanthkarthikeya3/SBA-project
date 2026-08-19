import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper to initialize Google Gen AI safely
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      currency: "INR (₹)",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Copilot Chat API endpoint
  app.post("/api/copilot/chat", async (req, res) => {
    try {
      const { message, client, conversationHistory } = req.body;
      const ai = getAI();

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (ai) {
        const clientContext = client
          ? `
Current Small Business MSME Client Profile:
- Name: ${client.name}
- Industry: ${client.industry}
- Risk Tier: ${client.riskTier}
- Annual Turnover / Revenue: ${client.annualRevenue}
- Currency: Indian Rupees (₹ / Lakhs / Crores)
- Quick Ratio: ${client.financialKPIs?.quickRatio} (Benchmark: ${client.financialKPIs?.quickRatioBenchmark})
- Monthly Burn Rate: ₹${client.financialKPIs?.monthlyBurnRate}k (Runway: ${client.financialKPIs?.runwayMonths} months)
- Operating Margin: ${client.financialKPIs?.operatingMargin}% (Benchmark: ${client.financialKPIs?.operatingMarginBenchmark}%)
- Total AR Outstanding: ₹${client.arAging?.totalOutstanding?.toLocaleString('en-IN') || 0} (₹${client.arAging?.days31to60?.toLocaleString('en-IN') || 0} in 31-60d, ₹${client.arAging?.days61to90?.toLocaleString('en-IN') || 0} in 61-90d)
- Overdue Invoices: ${JSON.stringify(client.arAging?.invoices || [])}
- Vendor Cost Drivers: ${JSON.stringify(client.vendorCostDrivers || [])}
`
          : "General Small Business Banking Advisory Context (INR / ₹ Currency)";

        const systemInstruction = `
You are the AI Advisory Copilot for Commercial & MSME Relationship Managers (RMs) in Small Business Banking.
Your role:
1. Provide proactive, data-grounded financial wellness, working capital, and risk advisory for small businesses.
2. ALWAYS use Indian Rupees (₹ / Lakhs / Crores) for all currency values and calculations.
3. Avoid generic, pushy, or hard-coded product selling. Focus on consultative business value, cash flow preservation, margin defense, TReDS invoice discounting, and explainable decision support.
4. Reference specific ledger facts, customer debtors (e.g. Whole Foods Regional, Sprouts), vendor cost surges (e.g. EcoTransit Solutions +12% logistics), and bank risk policies.
5. Keep answers concise, highly structured, and relationship-manager focused. Include actionable next steps for the banker.
6. Format your output with clear bold highlights, bullet points, and reference citations when applicable.
`;

        const prompt = `
${clientContext}

Conversation History:
${(conversationHistory || []).map((h: any) => `${h.sender === "rm" ? "Relationship Manager" : "Copilot"}: ${h.text}`).join("\n")}

Relationship Manager Query: "${message}"

Respond directly, providing clear analysis, specific numbers in INR (₹) from the ledger, grounded citations or policy references, and 2-3 suggested follow-up questions for the RM.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        const replyText = response.text || "I have analyzed the client records and generated recommendations based on current cash flow trajectories.";

        // Generate relevant domain citations based on content
        const citations = [];
        if (message.toLowerCase().includes("supply") || message.toLowerCase().includes("vendor") || message.toLowerCase().includes("cost") || message.toLowerCase().includes("ecotransit")) {
          citations.push({
            id: "cite-ecotransit",
            title: "EcoTransit Solutions Cold-Chain Ledger (Q2)",
            type: "ledger" as const,
            snippet: "Q2 Logistics cost ₹4,86,000 (+12.0% YoY vs ₹4,34,000). Expedited refrigerated transport routes to regional grocery hubs with diesel fuel surcharges.",
          });
        }
        if (message.toLowerCase().includes("receivable") || message.toLowerCase().includes("whole foods") || message.toLowerCase().includes("ar") || message.toLowerCase().includes("aging")) {
          citations.push({
            id: "cite-ar-aging",
            title: "AR Aging Schedule & Whole Foods Hub Invoices",
            type: "invoice" as const,
            snippet: "INV-2026-088 (₹6.45 Lakhs, 38d overdue) + INV-2026-071 (₹3.80 Lakhs, 62d overdue). ERP transition delay at debtor hub.",
          });
        }
        if (message.toLowerCase().includes("loan") || message.toLowerCase().includes("policy") || message.toLowerCase().includes("credit") || message.toLowerCase().includes("eligibility") || message.toLowerCase().includes("treds")) {
          citations.push({
            id: "cite-bank-policy",
            title: "MSME Commercial Credit & TReDS Policy §4.2",
            type: "policy" as const,
            snippet: "Wholesale suppliers to corporate buyers qualify for 90% instant advance at 1.15% discount per 30 days without long-term debt covenants.",
          });
        }

        return res.json({
          text: replyText,
          citations,
          suggestedFollowUps: [
            "Check eligibility for Working Capital CC/OD line",
            "Simulate 20% seasonal revenue dip in Q3",
            "Draft client advisory review agenda",
          ],
        });
      }

      // Contextual fallback when Gemini API key is processing or local
      let fallbackText = `I have analyzed ${client?.name || "the client"}'s recent financial ledger and transactions in Rupees (₹).`;
      const lower = message.toLowerCase();
      const citations = [];

      if (lower.includes("supply chain") || lower.includes("vendor") || lower.includes("cost") || lower.includes("ecotransit")) {
        fallbackText = `Q2 supply chain costs increased by **8.4% YoY overall**.\n\nThe primary driver is a **12.0% increase** in cold-chain logistics from *EcoTransit Solutions* (₹4,86,000 vs ₹4,34,000 prior year). Packaging and soil amendment costs remained stable (+1.0% and +4.8% respectively).\n\n**Advisory Recommendation**: Suggest exploring our Commercial Fleet Fuel Hedging program or negotiating quarterly volume freight tiers with regional carriers to protect operating margins.`;
        citations.push({
          id: "cite-1",
          title: "EcoTransit Ledger.pdf",
          type: "ledger" as const,
          snippet: "Q2 Logistics spend rose from ₹4.34 Lakhs to ₹4.86 Lakhs (+12% YoY) driven by diesel fuel surcharges.",
        });
      } else if (lower.includes("loan") || lower.includes("credit") || lower.includes("eligibility")) {
        fallbackText = `**Credit & Facility Eligibility Assessment for ${client?.name || "Green Valley Organics"}**:\n\n- **Current DSCR**: **${client?.financialKPIs?.dscr || 1.62}x** (Exceeds bank threshold of 1.25x)\n- **Quick Ratio**: **${client?.financialKPIs?.quickRatio || 1.4}** (Healthy vs 1.1 benchmark)\n- **Eligible Facilities**:\n  1. *Secured Working Capital CC/OD Line*: Pre-qualified for up to **₹35,00,000 (₹35 Lakhs)** at RBLR + 1.25%.\n  2. *TReDS / Selective AR Acceleration*: Instant 90% advance on Whole Foods & Sprouts invoices at 1.15% discount rate.\n  3. *CGTMSE Growth Term Loan*: Eligible for up to ₹1.2 Crore with 7-year amortization.\n\n*Compliance Note*: Standard MSME classification with pristine track record.`;
        citations.push({
          id: "cite-policy",
          title: "MSME Commercial Underwriting Guidelines 2026",
          type: "policy" as const,
          snippet: "Businesses with DSCR > 1.35x and Quick Ratio > 1.2x qualify for expedited delegated credit committee sanction.",
        });
      } else if (lower.includes("receivable") || lower.includes("ar") || lower.includes("aging") || lower.includes("whole foods")) {
        fallbackText = `**Accounts Receivable Breakdown (INR)**:\n\n- **Total Outstanding**: ₹32,90,000 (₹32.9 Lakhs) across 4 major commercial buyers.\n- **Delayed Aging (>30 days)**: ₹14,40,000 (43.7% of total AR).\n- **Primary Concentration**: *Whole Foods Regional Hub* represents **₹10,25,000 (₹10.25 Lakhs)** across two overdue invoices (38 days and 62 days overdue).\n\n**Actionable RM Strategy**: Recommend TReDS non-recourse invoice discounting to bridge the gap during Whole Foods' ERP system migration, protecting August payroll without adding balance sheet debt.`;
        citations.push({
          id: "cite-ar",
          title: "Accounts Receivable Aging Schedule - July 2026",
          type: "invoice" as const,
          snippet: "Whole Foods Hub INV-2026-088 (₹6.45L) and INV-2026-071 (₹3.80L) represent 71% of aged receivables > 30 days.",
        });
      } else {
        fallbackText = `Based on the latest monthly cash flow model for **${client?.name || "Green Valley Organics"}**:\n\n- **Current Cash Runway**: **${client?.financialKPIs?.runwayMonths || 14} Months** (₹42k/mo net burn rate).\n- **Proactive Risk Highlight**: Historical agricultural data indicates an upcoming **20% seasonal dip in Q3** (harvest transition), compounded by ₹10.25 Lakhs in delayed wholesale receivables.\n- **Recommended Banker Focus**: Review liquidity buffers and present the **Selective AR Acceleration** and **Automated Insured Cash Sweep (6.85% p.a.)** to maximize cash stability and interest earnings.`;
      }

      return res.json({
        text: fallbackText,
        citations,
        suggestedFollowUps: [
          "Check loan eligibility",
          "Summarize latest credit policy",
          "Simulate Q3 Stress Test",
        ],
      });
    } catch (err: any) {
      console.error("Error in /api/copilot/chat:", err);
      res.status(500).json({ error: err.message || "Failed to process advisory query" });
    }
  });

  // Client Meeting Summary / Executive Email Generator API
  app.post("/api/advisory/generate-summary", async (req, res) => {
    try {
      const { client, tone, focusArea } = req.body;
      const ai = getAI();

      if (ai && client) {
        const prompt = `
Generate a professional, highly articulate small business banking advisory document in Indian Rupees (₹ / Lakhs / Crores) for the Relationship Manager to share or use with the client.
Client: ${client.name} (${client.industry})
Contact: ${client.contactPerson?.name}, ${client.contactPerson?.title}
Tone: ${tone || "Empathetic & Consultative Financial Partner"}
Focus Area: ${focusArea || "Cash Flow Optimization, Receivables Relief & Treasury Yield"}
Financial Context: Quick Ratio ${client.financialKPIs?.quickRatio}, Runway ${client.financialKPIs?.runwayMonths} months, AR Outstanding ₹${client.arAging?.totalOutstanding?.toLocaleString('en-IN')}, Delayed AR ₹${(client.arAging?.days31to60 + client.arAging?.days61to90)?.toLocaleString('en-IN')}.

Output format:
1. Executive Meeting Briefing / Email Subject & Body (in Indian Rupees ₹)
2. Key Observations (Transparent & grounded in their ledger data)
3. Tailored Advisory Recommendations (Framed around business value, avoiding hard selling)
4. Proposed Next Steps & Discussion Agenda for upcoming review
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
        });

        return res.json({ content: response.text });
      }

      // Default structured memo in Rupees (₹)
      const content = `SUBJECT: Financial Health Review & Proactive Working Capital Optimization — ${client?.name || "Green Valley Organics"}

Dear ${client?.contactPerson?.name || "Elena"},

I hope your summer harvest operations are progressing smoothly. 

As part of our proactive relationship banking commitment, our advisory analytics team conducted a mid-year liquidity and cash flow review for Green Valley Organics. We noticed several strong positive indicators alongside two strategic areas where we can help safeguard your cash flow during the upcoming Q3 seasonal transition.

### 1. Key Financial Observations
- **Healthy Balance Sheet Foundation**: Your Quick Ratio stands strong at **1.4x** (above the 1.1x industry benchmark), providing 14 months of operating runway.
- **Receivables Lengthening**: Due to recent ERP transitions at regional wholesale supermarket distributors (such as Whole Foods), accounts receivable past 30 days have expanded to **₹10,25,000 (₹10.25 Lakhs)**.
- **Cold-Chain Logistics Surge**: Q2 logistics costs increased by **12.0% YoY** via EcoTransit Solutions (₹4,86,000 total spend).

### 2. Proactive Advisory Solutions (Non-Debt & Liquidity Support)
1. **TReDS & Selective Receivables Acceleration**: We can activate an automated same-day invoice advance on your approved wholesale grocer accounts at a 1.15% discount. This frees up ₹10.25 Lakhs in trapped cash without adding balance sheet debt.
2. **Automated Insured Cash Sweep (ICS)**: Put your ₹32 Lakhs operating cash float into top-tier government liquidity funds earning **6.85% p.a.** overnight with zero lockup or payroll interruption.

### 3. Proposed Discussion Agenda for Our Upcoming Review
- [ ] Review Q3 harvest cash flow forecast & stress scenarios
- [ ] Walk through invoice acceleration setup (takes under 48 hours)
- [ ] Review vendor freight discount structures

Warm regards,

**Marcus Vance**
VP, Commercial Banking Relationship Manager
Small Business Advisory Group`;

      return res.json({ content });
    } catch (err: any) {
      console.error("Error in /api/advisory/generate-summary:", err);
      res.status(500).json({ error: err.message || "Failed to generate briefing" });
    }
  });

  // What-If Cash Flow Stress Test Simulation API
  app.post("/api/stress/simulate", (req, res) => {
    const { client, revenueDropPct = 20, cogsSurgePct = 10, arDelayDays = 30 } = req.body;

    const baseBurn = client?.financialKPIs?.monthlyBurnRate || 42;
    const baseRevenue = client?.financialKPIs?.averageMonthlyRevenue || 2375000;
    const baseRunway = client?.financialKPIs?.runwayMonths || 14;

    // Recalculate stress impact
    const monthlyRevenueImpact = (baseRevenue * (revenueDropPct / 100));
    const monthlyCostImpact = ((baseBurn * 1000) * (cogsSurgePct / 100));
    const totalMonthlyCashDrag = (monthlyRevenueImpact + monthlyCostImpact) / 1000;
    const stressedMonthlyBurn = Math.round(baseBurn + totalMonthlyCashDrag);
    const stressedRunwayMonths = Math.max(2, Math.round((baseRunway * baseBurn) / Math.max(1, stressedMonthlyBurn)));
    const stressedCashBufferDays = Math.max(12, Math.round(client?.financialKPIs?.cashBufferDays * (1 - (arDelayDays / 90))));

    res.json({
      revenueDropPct,
      cogsSurgePct,
      arDelayDays,
      stressedMonthlyBurn,
      stressedRunwayMonths,
      stressedCashBufferDays,
      runwayDelta: stressedRunwayMonths - baseRunway,
      burnDeltaPct: Math.round(((stressedMonthlyBurn - baseBurn) / baseBurn) * 100),
      aiAssessment: `Under a ${revenueDropPct}% seasonal revenue dip combined with a ${cogsSurgePct}% COGS inflation and a ${arDelayDays}-day AR delay, cash runway reduces from ${baseRunway} to ${stressedRunwayMonths} months. Activating a ₹35 Lakhs working capital facility restores runway back to 13+ months.`,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Small Business Banking Advisory Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
