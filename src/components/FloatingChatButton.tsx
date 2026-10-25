import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function FloatingChatButton() {
  return (
    <Link to="/chat" className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-forest-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-forest-600/30 hover:bg-forest-600/90 transition-colors"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </Link>
  );
}
