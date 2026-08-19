import express from "express";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const app = express();
app.use(express.json({ limit: "10mb" }));

const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

// 1. Health Check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// 2. Copilot Chat Endpoint
app.post("/api/copilot/chat", async (req, res) => {
    try {
        const { message, client, conversationHistory } = req.body;
        const ai = getAI();

        if (!ai) throw new Error("Gemini API key is missing");

        const clientContext = client
            ? `Client: ${client.name} (${client.industry})\nQuick Ratio: ${client.financialKPIs?.quickRatio}\nTotal AR: ₹${client.arAging?.totalOutstanding}\nRunway: ${client.financialKPIs?.runwayMonths} months`
            : "Generic MSME Client";

        const systemInstruction = `You are an AI Banking Advisory Copilot for RMs. Provide brief, consultative financial analysis in Indian Rupees (₹). Generate 3 follow-up prompts.`;

        const responseSchema: Schema = {
            type: Type.OBJECT,
            properties: {
                text: { type: Type.STRING },
                citations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["ledger", "policy", "invoice", "market_benchmark"] },
                            snippet: { type: Type.STRING },
                        },
                    },
                },
                suggestedFollowUps: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        };

        const chatPrompt = `${clientContext}\n\nRM Query: "${message}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: chatPrompt,
            config: {
                systemInstruction,
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        res.json(JSON.parse(response.text || "{}"));
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 3. New Client Intake Endpoint
app.post("/api/advisory/analyze-new-client", async (req, res) => {
    // Basic catch-all to prevent Vercel 404s on the new analysis modal
    res.json({
        riskTier: "Moderate",
        employees: 15,
        financialKPIs: {
            quickRatio: 1.2, monthlyBurnRate: 35, runwayMonths: 12, operatingMargin: 15, dscr: 1.3, cashBufferDays: 45
        },
        arAging: {
            current: 100000, days31to60: 50000, days61to90: 10000, days90Plus: 0, totalOutstanding: 160000, invoices: []
        },
        vendorCostDrivers: [],
        riskAlerts: [],
        recommendations: [],
        cashFlowTrajectory: []
    });
});

export default app;