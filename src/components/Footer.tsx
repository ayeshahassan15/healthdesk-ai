import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-forest-600/10 bg-white/50 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="text-xl font-bold text-forest-600 mb-2">🌱 HealthDesk AI</div>
          <p className="text-sage-500 text-sm max-w-xs">
            A premium AI-powered wellness retreat platform rooted in holistic health.
          </p>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-sm text-sage-500 mb-2 flex items-center justify-center md:justify-end gap-1">
            Built with <Heart className="w-4 h-4 text-red-400 fill-current" /> by Google AI Studio
          </div>
          <div className="text-xs text-sage-500/70 italic">
            HealthDesk AI is not a substitute for professional medical advice.
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-forest-600/5 text-center text-xs text-sage-500/50">
        © 2026 HealthDesk AI | AI Seekho
      </div>
    </footer>
  );
}
