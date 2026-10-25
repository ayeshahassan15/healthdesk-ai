import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Toast {
  id: number;
  message: string;
}

let toastId = 0;
let observers: ((toasts: Toast[]) => void)[] = [];

export const showToast = (message: string) => {
  const id = ++toastId;
  const newToast = { id, message };
  toasts = [...toasts, newToast];
  observers.forEach((o) => o(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    observers.forEach((o) => o(toasts));
  }, 3000);
};

let toasts: Toast[] = [];

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    observers.push(setCurrentToasts);
    return () => {
      observers = observers.filter((o) => o !== setCurrentToasts);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {currentToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-forest-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
