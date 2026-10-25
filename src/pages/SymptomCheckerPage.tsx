import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Sparkles, Share2, History, CheckCircle2, AlertCircle, Info, ExternalLink } from "lucide-react";
import { showToast } from "../components/Toast";
import { cn } from "../lib/utils";
import { analyzeSymptomsStream } from "../services/geminiService";

interface AnalysisResult {
  text: string;
  score: number;
  urgency: "mild" | "moderate" | "urgent";
}

interface RecentCheck {
  id: string;
  date: string;
  symptoms: string;
  urgency: string;
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [recentChecks, setRecentChecks] = useState<RecentCheck[]>([]);
  const [typedText, setTypedText] = useState("");
  const fullSubtitle = "Gentle AI analysis to help you understand your body's signals naturally.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullSubtitle.slice(0, index));
      index++;
      if (index > fullSubtitle.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("symptom_history");
    if (saved) setRecentChecks(JSON.parse(saved));
  }, []);

  const saveHistory = (symptoms: string, urgency: string) => {
    const newCheck = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      symptoms: symptoms.slice(0, 40) + "...",
      urgency,
    };
    const updated = [newCheck, ...recentChecks].slice(0, 3);
    setRecentChecks(updated);
    localStorage.setItem("symptom_history", JSON.stringify(updated));
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const responseStream = await analyzeSymptomsStream(symptoms);

      let analysisText = "";
      
      for await (const chunk of responseStream) {
        analysisText += chunk.text;
        setResult({
          text: analysisText,
          score: 85, // Placeholder
          urgency: analysisText.toLowerCase().includes("urgent") ? "urgent" : analysisText.toLowerCase().includes("moderate") ? "moderate" : "mild"
        });
      }

      // Finalize logic
      const finalUrgency = analysisText.toLowerCase().includes("urgent") ? "urgent" : analysisText.toLowerCase().includes("moderate") ? "moderate" : "mild";
      const finalScore = finalUrgency === "urgent" ? 30 : finalUrgency === "moderate" ? 65 : 92;
      
      setResult(prev => prev ? { ...prev, score: finalScore, urgency: finalUrgency } : null);
      saveHistory(symptoms, finalUrgency);
    } catch (error) {
      console.error(error);
      showToast("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    const summary = `HealthDesk AI Symptom Analysis:\nUrgency: ${result.urgency.toUpperCase()}\n\nSummary: ${result.text.slice(0, 100)}...`;
    navigator.clipboard.writeText(summary);
    showToast("Copied to clipboard!");
  };

  const prefill = () => {
    setSymptoms("I have had a mild headache for 2 days, and a slight fever of 100°F. My neck feels a bit stiff.");
  };

  return (
    <div className="pt-20 pb-20 px-6 max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-forest-700">
          Symptom <span className="text-forest-600">Checker</span>
        </h1>
        <p className="text-lg text-sage-500 h-8">
          {typedText}
          <span className="inline-block w-1 h-5 bg-forest-600 ml-1 animate-pulse" />
        </p>
      </header>

      <section className="bg-white p-8 rounded-3xl border border-forest-600/10 shadow-xl shadow-forest-600/5 space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-bold text-forest-700 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4" /> Describe your symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have had a mild headache for 2 days, and a slight fever of 100°F..."
            className="w-full h-40 p-5 bg-mint-50/30 border border-forest-600/10 rounded-2xl focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all outline-none text-forest-700 leading-relaxed resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={analyzeSymptoms}
            disabled={isAnalyzing || !symptoms.trim()}
            className="btn-primary flex-grow py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Analyze Symptoms
              </>
            )}
          </button>
          <button
            onClick={prefill}
            className="btn-secondary px-8 py-4 flex items-center justify-center gap-2"
          >
            Try an Example
          </button>
        </div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border-l-8 border-l-forest-600 border border-forest-600/10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-grow space-y-6">
                <div className="flex items-center gap-4">
                  <UrgencyBadge type={result.urgency} />
                  <div className="text-xs text-sage-500 font-mono uppercase tracking-tighter">
                    Generated by HealthDesk AI • Just now
                  </div>
                </div>

                <div className="markdown-body font-medium text-forest-700/90 whitespace-pre-wrap">
                  {result.text}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm font-bold text-forest-600 hover:text-forest-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share Results
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 min-w-[150px]">
                <HealthScoreRing score={result.score} />
                <div className="text-center">
                  <div className="text-sm font-bold text-forest-700">Wellness Score</div>
                  <div className="text-xs text-sage-500">Based on symptoms</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {recentChecks.length > 0 && (
        <section className="space-y-6 pt-10">
          <h3 className="text-xl font-bold text-forest-700 flex items-center gap-2">
            <History className="w-5 h-5" /> Recent Checks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentChecks.map((check) => (
              <div key={check.id} className="bg-white p-5 rounded-2xl border border-forest-600/5 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-sage-500">{check.date}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold",
                    check.urgency === "mild" ? "bg-green-100 text-green-700" :
                    check.urgency === "moderate" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {check.urgency}
                  </span>
                </div>
                <p className="text-sm font-medium text-forest-700 line-clamp-2">
                  {check.symptoms}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function UrgencyBadge({ type }: { type: AnalysisResult["urgency"] }) {
  const configs = {
    mild: { color: "bg-green-500", text: "Mild — Monitor at home", icon: <CheckCircle2 className="w-4 h-4" /> },
    moderate: { color: "bg-amber-500", text: "Moderate — See a doctor", icon: <Info className="w-4 h-4" /> },
    urgent: { color: "bg-red-500", text: "Urgent — Seek help now", icon: <AlertCircle className="w-4 h-4" /> },
  };

  const config = configs[type];

  return (
    <div className={cn("px-4 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-forest-600/10", config.color)}>
      {config.icon}
      {config.text}
    </div>
  );
}

function HealthScoreRing({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          className="stroke-mint-100 fill-none"
          strokeWidth="10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          className="stroke-forest-600 fill-none"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-forest-600">{score}</span>
        <span className="text-[10px] text-sage-500 uppercase font-bold">Points</span>
      </div>
    </div>
  );
}
