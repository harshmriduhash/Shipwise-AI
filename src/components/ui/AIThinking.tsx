import { motion } from "framer-motion";

interface AIThinkingProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const AIThinking = ({ label = "Analyzing", size = "md" }: AIThinkingProps) => {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-3 h-3" : "w-2 h-2";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={`${dotSize} rounded-full bg-primary`}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      {label && (
        <motion.p
          className={`${textSize} text-muted-foreground`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {label}...
        </motion.p>
      )}
    </div>
  );
};

export default AIThinking;
