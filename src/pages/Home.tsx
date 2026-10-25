import { motion } from "motion/react";
import { Thermometer, Shield, BarChart3, ArrowRight, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const featureTags = [
    { icon: "🫁", label: "Breathing" },
    { icon: "💧", label: "Hydration" },
    { icon: "🧘", label: "Mindfulness" },
    { icon: "😴", label: "Sleep" },
  ];

  const features = [
    {
      title: "Nature Triage",
      desc: "Instant symptom analysis guided by gentle AI feedback.",
      icon: <Thermometer className="w-8 h-8" />,
      path: "/symptom-checker",
      btnText: "Explore Nature Path",
      emoji: "🌡️"
    },
    {
      title: "Guard Protocols",
      desc: "Direct communication with HealthDesk AI for personal guidance.",
      icon: <Shield className="w-8 h-8" />,
      path: "/chat",
      btnText: "Start Chat",
      emoji: "🛡️"
    },
    {
      title: "Wellness Ops",
      desc: "Monitor your health vitals and track progress in real-time.",
      icon: <BarChart3 className="w-8 h-8" />,
      path: "/dashboard",
      btnText: "Open Dashboard",
      emoji: "📊"
    },
  ];

  return (
    <div className="pt-20 pb-10 px-6 max-w-7xl mx-auto space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-forest-700 leading-tight">
            Heal Naturally, <br />
            <span className="text-forest-600">Live Fully.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-sage-500 max-w-2xl mx-auto"
        >
          Gentle AI wellness companion rooted in holistic health. Experience a new way to understand your body with our Soft Mint Nature ecosystem.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 py-4"
        >
          {featureTags.map((tag, idx) => (
            <div
              key={idx}
              className="bg-white border border-forest-600/10 text-forest-600 px-4 py-2 rounded-full text-sm font-medium animate-float flex items-center gap-2 shadow-sm"
              style={{ animationDelay: `${idx * 0.5}s` }}
            >
              <span>{tag.icon}</span>
              {tag.label}
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link to="/symptom-checker" className="btn-primary text-lg px-10 py-4">
            Check Wellness
          </Link>
          <Link to="/dashboard" className="btn-secondary text-lg px-10 py-4">
            Daily Tips
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * idx }}
            onClick={() => handleCardClick(feature.path)}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
            }}
            className="group cursor-pointer bg-white p-8 rounded-3xl border border-forest-600/10 shadow-lg shadow-forest-600/5 card-hover relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-mint-100 rounded-2xl flex items-center justify-center text-forest-600 mb-6 group-hover:bg-forest-600 group-hover:text-white transition-colors duration-300">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-forest-700 mb-3">{feature.emoji} {feature.title}</h3>
            <p className="text-sage-500 mb-8 leading-relaxed">
              {feature.desc}
            </p>
            <div className="flex items-center gap-2 text-forest-600 font-bold mt-auto group-hover:translate-x-2 transition-transform">
              {feature.btnText} <ArrowRight className="w-4 h-4" />
            </div>
            {/* Soft glow on hover */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-forest-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <AlertTriangle className="w-32 h-32 text-red-500" />
        </div>
        <div className="bg-red-100 p-4 rounded-full text-red-600 z-10">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="text-center md:text-left z-10">
          <h4 className="text-lg font-extrabold text-red-900 mb-1 tracking-tight">EMERGENCY PROTOCOL</h4>
          <p className="text-red-700 font-medium">
            If you are experiencing life-threatening symptoms like chest pain or extreme breathing difficulty, call emergency services immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
