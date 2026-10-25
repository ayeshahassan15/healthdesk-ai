import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Droplets, Moon, Footprints, Flame, Calculator, Sparkles, Lightbulb, History, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

interface SymptomHistory {
  id: string;
  date: string;
  symptoms: string;
  urgency: string;
}

export default function Dashboard() {
  const [bmi, setBmi] = useState<number | null>(null);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [history, setHistory] = useState<SymptomHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("symptom_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "text-amber-600" };
    if (val < 25) return { label: "Normal Weight", color: "text-forest-600" };
    if (val < 30) return { label: "Overweight", color: "text-amber-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  const stats = [
    { label: "Water Intake", value: "2.4L", target: "3L", icon: <Droplets className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
    { label: "Sleep Hours", value: "7.5h", target: "8h", icon: <Moon className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
    { label: "Steps Today", value: "8,432", target: "10k", icon: <Footprints className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600" },
    { label: "Calories", value: "1,840", target: "2k", icon: <Flame className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
  ];

  const wellnessTips = [
    { title: "Forest Bathing", text: "Spend 20 minutes in a green space to lower cortisol levels.", icon: "🌲" },
    { title: "Deep Breathing", text: "Try the 4-7-8 technique twice a day for better stress management.", icon: "🫁" },
    { title: "Hydration Logic", text: "Start your day with warm lemon water to awaken your digestion.", icon: "🍋" },
    { title: "Digital Detox", text: "Avoid screens 1 hour before bed for deeper REM cycles.", icon: "📱" },
    { title: "Sunlight Fix", text: "Get 15 mins of morning sun to regulate your circadian rhythm.", icon: "☀️" },
  ];

  return (
    <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-black text-forest-700">Wellness <span className="text-forest-600">Dashboard</span></h1>
        <p className="text-sage-500 mt-2">Manage your health metrics and holistic vitals in one place.</p>
      </header>

      {/* Stat Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-3xl border border-forest-600/5 shadow-lg shadow-forest-600/5 flex items-center gap-5"
          >
            <div className={cn("p-4 rounded-2xl", stat.color)}>
              {stat.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-sage-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-forest-700">{stat.value}</div>
              <div className="text-[10px] text-sage-500">Target: {stat.target}</div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BMI Calculator */}
        <section className="lg:col-span-1 bg-white p-8 rounded-3xl border border-forest-600/10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-forest-600" />
            <h3 className="text-xl font-bold text-forest-700">BMI Calculator</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-sage-500 uppercase">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 bg-mint-50/30 border border-forest-600/10 rounded-xl focus:ring-1 focus:ring-forest-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-sage-500 uppercase">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 bg-mint-50/30 border border-forest-600/10 rounded-xl focus:ring-1 focus:ring-forest-600 outline-none"
              />
            </div>
            <button
              onClick={calculateBMI}
              className="w-full btn-primary py-3"
            >
              Calculate BMI
            </button>
          </div>

          {bmi && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6 border-t border-forest-600/5 flex flex-col items-center gap-4"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-mint-100 fill-none" strokeWidth="8" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-forest-600 fill-none"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    animate={{ strokeDashoffset: (2 * Math.PI * 40) - (Math.min(bmi, 40) / 40) * (2 * Math.PI * 40) }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-black text-forest-700">{bmi}</span>
              </div>
              <div className={cn("font-bold text-sm", getBMICategory(bmi).color)}>
                {getBMICategory(bmi).label}
              </div>
            </motion.div>
          )}
        </section>

        {/* History + Tip of Day */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border-l-[12px] border-l-forest-600 border border-forest-600/10 shadow-xl flex gap-6 items-start">
            <div className="bg-forest-600 p-4 rounded-2xl text-white">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest-700 mb-2">Health Tip of the Day</h3>
              <p className="text-sage-500 leading-relaxed">
                "Intermittent mindfulness isn't just for meditators. Set a 30-second timer every 3 hours to simply observe your breath without judgment. It resets your nervous system instantly."
              </p>
            </div>
          </section>

          {history.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-forest-700 flex items-center gap-2">
                <History className="w-5 h-5" /> Recent Checks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {history.map((check) => (
                  <div key={check.id} className="bg-white p-5 rounded-2xl border border-forest-600/5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-sage-500 uppercase tracking-widest">
                      <span>{check.date}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-bold",
                        check.urgency === "mild" ? "bg-green-100 text-green-700" :
                        check.urgency === "moderate" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {check.urgency}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-forest-700 line-clamp-1">{check.symptoms}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Wellness Tip Grid */}
      <section className="space-y-6 pb-10">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-forest-600" />
          <h3 className="text-2xl font-black text-forest-700">Health & Harmony Guide</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {wellnessTips.map((tip, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-forest-600/5 shadow-lg group"
            >
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                {tip.icon}
              </div>
              <h4 className="font-bold text-forest-700 mb-2">{tip.title}</h4>
              <p className="text-xs text-sage-500 leading-relaxed">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
