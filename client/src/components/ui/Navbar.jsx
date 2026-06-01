import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, UserRound, Sparkles } from "lucide-react";

export function Navbar({ user, onLogout, onProfileOpen, isDemoMode, onToggleDemo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    onProfileOpen();
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
      {/* Search Bar / Welcome Text */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger could go here, handled by App.jsx layout */}
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Overview
          </p>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        
        {/* Demo Mode Toggle Badge */}
        <button
          onClick={onToggleDemo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
            isDemoMode
              ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm shadow-teal-50"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles size={12} className={isDemoMode ? "text-teal-500 animate-pulse" : "text-slate-400"} />
          <span>{isDemoMode ? "Demo Mode" : "Live Mode"}</span>
        </button>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-premium border border-transparent hover:border-slate-100"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white font-bold flex items-center justify-center font-outfit shadow-sm">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {user?.name || "User"}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">
                {user?.email || "personal"}
              </span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Account Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-100 shadow-xl overflow-hidden py-1 transform origin-top-right transition-all z-40">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold"
              >
                <UserRound size={14} className="text-slate-400" />
                <span>Profile Settings</span>
              </button>
              
              <hr className="border-slate-100" />
              
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50/50 transition-colors text-xs font-semibold"
              >
                <LogOut size={14} className="text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
