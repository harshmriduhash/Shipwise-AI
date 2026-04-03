import { motion } from "framer-motion";
import { Inbox, GitPullRequest, TestTube, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type?: "pr" | "tests" | "notifications" | "generic";
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

const icons = {
  pr: GitPullRequest,
  tests: TestTube,
  notifications: Bell,
  generic: Inbox,
};

const EmptyState = ({
  type = "generic",
  title = "Nothing here yet",
  description = "Get started by connecting your first repository.",
  action,
}: EmptyStateProps) => {
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5"
      >
        <Icon className="w-7 h-7 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
