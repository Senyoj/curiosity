import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Settings,
  Home,
  BarChart2,
  AlertTriangle,
} from "lucide-react";
import { StatusIndicator } from "../ui/StatusIndicator";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "Historical", path: "/historical", icon: <BarChart2 size={18} /> },
    {
      name: "Configuration",
      path: "/configuration",
      icon: <Settings size={18} />,
    },
    { name: "Alerts", path: "/alerts", icon: <AlertTriangle size={18} /> },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-lg font-semibold tracking-tight">
            Curio<span className="text-primary">sity</span>
          </span>
          <StatusIndicator className="ml-3" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <button className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent mr-2">
            <Bell size={20} />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card shadow-lg border-t">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
