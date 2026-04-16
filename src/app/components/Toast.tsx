import { motion, AnimatePresence } from "motion/react";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-orange-600",
    info: "text-blue-600",
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 right-4 z-[100]"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[type]}`}>
            <Icon className={`size-5 ${iconColors[type]}`} />
            <p className="font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
