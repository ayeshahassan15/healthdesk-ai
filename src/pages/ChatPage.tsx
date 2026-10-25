import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { startWellnessChat } from "../services/geminiService";
import { saveChatMessage } from "../services/firebaseService";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      content: "Hello! I'm HealthDesk AI, your friendly health assistant. How can I help you today? Please remember, for emergencies like chest pain or extreme breathing difficulty, call emergency services immediately.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    saveChatMessage(sessionId, "user", input);
    setInput("");
    setIsTyping(true);

    try {
      const chat = startWellnessChat(messages.map(m => ({ role: m.role, content: m.content })));
      const result = await chat.sendMessageStream({ message: input });

      let aiResponse = "";
      const aiId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiId, role: "model", content: "" }]);

      for await (const chunk of result) {
        aiResponse += chunk.text;
        setMessages((prev) => 
          prev.map(m => m.id === aiId ? { ...m, content: aiResponse } : m)
        );
      }
      saveChatMessage(sessionId, "model", aiResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-20 h-[calc(100vh-64px)] px-6 max-w-4xl mx-auto flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-forest-700">Wellness <span className="text-forest-600">Chat</span></h1>
          <p className="text-sage-500 text-sm">Direct communication with your personal AI health companion.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-forest-600/10 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-forest-600 uppercase tracking-widest">AI Online</span>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-6 pr-4 custom-scrollbar mb-10 p-4 bg-white/30 rounded-3xl border border-forest-600/5 shadow-inner"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === "user" ? "bg-forest-600 text-white" : "bg-white text-forest-600 border border-forest-600/10"
              )}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-3xl text-sm leading-relaxed",
                msg.role === "user" 
                  ? "bg-forest-600 text-white rounded-tr-none shadow-lg shadow-forest-600/20" 
                  : "bg-white text-forest-700 border border-forest-600/10 rounded-tl-none shadow-sm"
              )}>
                {msg.content || <div className="animate-pulse">HealthDesk AI is thinking...</div>}
              </div>
            </motion.div>
          ))}
          {isTyping && messages[messages.length - 1].role === "user" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white text-forest-600 border border-forest-600/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-forest-600/10 shadow-sm flex gap-1 items-center">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-forest-600 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-forest-600 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-forest-600 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative pb-10">
        <div className="bg-white p-2 rounded-full border border-forest-600/10 shadow-2xl flex items-center gap-2 group focus-within:border-forest-600 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message here..."
            className="flex-grow bg-transparent px-6 py-3 outline-none text-forest-700 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-forest-600 text-white rounded-full flex items-center justify-center hover:bg-forest-700 transition-all active:scale-90 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
