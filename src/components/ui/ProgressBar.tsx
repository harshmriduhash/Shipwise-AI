import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  variant?: "default" | "success" | "warning" | "destructive";
}

const variantColors = {
  default: "bg-primary",
  success: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const ProgressBar = ({ value, label, showValue = true, size = "sm", variant = "default" }: ProgressBarProps) => {
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          {showValue && <span className="text-xs font-medium text-foreground">{value}%</span>}
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-muted overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${variantColors[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
