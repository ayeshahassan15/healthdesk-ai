import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeSymptomsStream = async (symptoms: string) => {
  const prompt = `You are HealthDesk AI, a friendly health assistant. 
  Analyze these symptoms: "${symptoms}".
  
  Responsibilities:
  1. Help identify possible causes by asking clear follow-up questions (one at a time).
  2. Provide general health tips and wellness advice.
  3. ALWAYS remind the user you are not a doctor.
  4. For emergencies (chest pain, difficulty breathing, numbness), tell them to CALL EMERGENCY SERVICES IMMEDIATELY.
  
  Context Rules:
  - NEVER diagnose with certainty.
  - Ask for duration, severity (1-10), and location if not provided.
  - Keep response under 120 words.
  - Include keywords like [MILD], [MODERATE], or [URGENT] to indicate category at the start of your medical advice section.
  
  Respond in the language of the user.`;

  return ai.models.generateContentStream({
    model: "gemini-3.8-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
};

export const getHealthTips = async () => {
  const prompt = "Generate 5 concise, science-backed daily health tips for wellness. Return them in plain JSON. Return ONLY a JSON list of objects with { id, tip, icon (choose a lucide icon name like 'Droplets', 'Moon', 'Footprints', 'Flame', 'Apple', 'Zap', 'Leaf') }.";
  
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

export const startWellnessChat = (history: { role: "user" | "model"; content: string }[]) => {
  return ai.chats.create({
model: "gemini-3.8-flash",
    config: {
      systemInstruction: "You are HealthDesk AI, a friendly and empathetic AI health assistant. Help users understand their symptoms by asking clear follow-up questions one at a time. Always remind users you are not a doctor. For emergencies like chest pain or breathing difficulty, immediately say to call emergency services. Be warm, concise, and supportive.",
    },
    history: history.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
  });
};
