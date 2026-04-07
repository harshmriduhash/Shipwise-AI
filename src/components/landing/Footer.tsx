import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              SHIPWISE<span className="gradient-text">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/security" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Security</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 SHIPWISE.ai · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
