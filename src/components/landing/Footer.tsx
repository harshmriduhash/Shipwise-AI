import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">SHIPWISE<span className="gradient-text">.ai</span></span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 SHIPWISE.ai · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
