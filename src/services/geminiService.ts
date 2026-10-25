type Msg = { role: "user" | "assistant"; content: string };

const CHAT_SYSTEM =
  "You are HealthDesk AI, a friendly and empathetic AI health assistant. Help users understand their symptoms by asking clear follow-up questions one at a time. Always remind users you are not a doctor. For emergencies like chest pain or breathing difficulty, immediately say to call emergency services. Be warm, concise, and supportive.";

async function* streamFromApi(body: object): AsyncGenerator<{ text: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: true }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) yield { text };
  }
}

async function complete(body: object): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: false }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.text || "";
}

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

  return streamFromApi({ messages: [{ role: "user", content: prompt }] });
};

export const getHealthTips = async () => {
  const prompt =
    'Generate 5 concise, science-backed daily health tips for wellness. Return ONLY a JSON object like {"tips": [{"id": 1, "tip": "...", "icon": "Droplets"}]}. For icon, choose a lucide icon name like Droplets, Moon, Footprints, Flame, Apple, Zap, or Leaf.';

  try {
    const text = await complete({
      messages: [{ role: "user", content: prompt }],
      json: true,
    });
    const parsed = JSON.parse(text || "[]");
    return Array.isArray(parsed) ? parsed : parsed.tips || [];
  } catch (e) {
    return [];
  }
};

export const startWellnessChat = (
  history: { role: "user" | "model"; content: string }[]
) => {
  const messages: Msg[] = history.map((m) => ({
    role: m.role === "model" ? "assistant" : "user",
    content: m.content,
  }));

  return {
    sendMessageStream: async ({ message }: { message: string }) => {
      messages.push({ role: "user", content: message });
      return (async function* () {
        let full = "";
        for await (const chunk of streamFromApi({ system: CHAT_SYSTEM, messages })) {
          full += chunk.text;
          yield chunk;
        }
        messages.push({ role: "assistant", content: full });
      })();
    },
    sendMessage: async ({ message }: { message: string }) => {
      messages.push({ role: "user", content: message });
      const text = await complete({ system: CHAT_SYSTEM, messages });
      messages.push({ role: "assistant", content: text });
      return { text };
    },
  };
};