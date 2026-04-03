import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center transition-shadow group-hover:glow-sm">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">
            SHIPWISE<span className="gradient-text">.ai</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link>
          {user && (
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground text-xs">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground text-xs">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground text-xs">
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")} className="glow-sm text-xs h-8">
                Start Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-border/30 px-6 py-4 space-y-3"
        >
          <Link to="/pricing" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/security" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Security</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => { signOut(); setOpen(false); }} className="block text-sm text-muted-foreground">Sign Out</button>
            </>
          ) : (
            <Button size="sm" onClick={() => { navigate("/auth"); setOpen(false); }} className="w-full">Sign In</Button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
