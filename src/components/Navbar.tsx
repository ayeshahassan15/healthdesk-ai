import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Checkup", path: "/symptom-checker" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Chat", path: "/chat" },
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className="w-8 h-8 text-forest-600 transition-transform group-hover:rotate-12" />
          <span className="text-2xl font-extrabold text-forest-600 tracking-tight">
            HealthDesk AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sage-500 font-medium transition-all relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-forest-600 after:transition-all hover:after:w-full",
                location.pathname === link.path && "text-forest-600 after:w-full"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/symptom-checker" className="btn-primary">
            Start Free
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-forest-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-forest-600/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium text-sage-500",
                location.pathname === link.path && "text-forest-600"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/symptom-checker" onClick={() => setIsOpen(false)} className="btn-primary text-center">
            Start Free
          </Link>
        </div>
      )}
    </nav>
  );
}
