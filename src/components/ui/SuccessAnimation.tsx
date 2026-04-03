import { motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";

interface StatusAnimationProps {
  type: "success" | "error" | "warning";
  message: string;
  show: boolean;
}

const config = {
  success: { icon: Check, bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  error: { icon: X, bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  warning: { icon: AlertTriangle, bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
};

const SuccessAnimation = ({ type, message, show }: StatusAnimationProps) => {
  if (!show) return null;
  const { icon: Icon, bg, text, border } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bg} ${border}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        <Icon className={`w-5 h-5 ${text}`} />
      </motion.div>
      <span className={`text-sm font-medium ${text}`}>{message}</span>
    </motion.div>
  );
};

export default SuccessAnimation;
