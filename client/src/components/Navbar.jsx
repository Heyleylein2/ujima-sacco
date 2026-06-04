import { Link, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, FileText, BarChart3, Shield } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: <Brain size={16} /> },
    { to: "/apply", label: "Apply for Loan", icon: <FileText size={16} /> },
    { to: "/officer", label: "Officer Dashboard", icon: <LayoutDashboard size={16} /> },
    { to: "/audit", label: "Bias Audit", icon: <BarChart3 size={16} /> },
  ];

  return (
    <nav
      style={{ backgroundColor: "var(--ujima-blue)" }}
      className="sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)" }}
          >
            U
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">UJIMA SACCO</p>
            <p className="text-xs leading-none" style={{ color: "var(--ujima-gold)" }}>
              AI Lending Ecosystem
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "text-white"
                  : "text-blue-200 hover:text-white hover:bg-white/10"
              }`}
              style={
                location.pathname === link.to
                  ? { backgroundColor: "var(--ujima-gold)", color: "var(--ujima-blue)" }
                  : {}
              }
            >
              {link.icon}
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-400/30 bg-green-400/10">
          <Shield size={12} className="text-green-400" />
          <span className="text-green-400 text-xs font-medium">SASRA Compliant</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;