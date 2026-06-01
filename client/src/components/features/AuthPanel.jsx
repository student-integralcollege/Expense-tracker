import React, { useState } from "react";
import { Sparkles, ArrowRight, Mail, Lock, User, Wallet } from "lucide-react";
import { BrandLogo } from "../ui/BrandLogo";

export function AuthPanel({ mode, onModeChange, onSubmit, onDemoStart, loading, error }) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBg px-4 py-12 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"></div>
      <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Marketing/Hero Info Panel */}
        <section className="lg:col-span-7 text-left space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <BrandLogo size="lg" className="shadow-md shadow-teal-100" />
            <div>
              <h1 className="font-extrabold font-outfit text-slate-800 text-xl leading-none">
                Expense Tracker
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                Personal Finance
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold">
            <Wallet size={14} />
            <span>Smart Personal Finance</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-outfit text-slate-800 tracking-tight leading-tight">
            Track expenses with a <span className="text-teal-500">premium dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Take control of your cash flow. Track daily transaction activity, manage category budgets, and get AI-driven coach feedback to optimize your saving rate.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white/60 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl">
              <h5 className="font-bold text-slate-800 text-sm">Real-time Analytics</h5>
              <p className="text-xs text-slate-400 mt-1">Visualize monthly income and expense distributions instantly.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl">
              <h5 className="font-bold text-slate-800 text-sm">AI Financial Insights</h5>
              <p className="text-xs text-slate-400 mt-1">Receive automated summaries to save up to 20% more monthly.</p>
            </div>
          </div>
        </section>

        {/* Card Form Panel */}
        <section className="lg:col-span-5 bg-white border border-slate-100 p-8 rounded-[16px] shadow-premium hover:shadow-premium-hover transition-premium w-full">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-premium ${
                mode === "login"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              type="button"
              onClick={() => onModeChange("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-premium ${
                mode === "signup"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              type="button"
              onClick={() => onModeChange("signup")}
            >
              Sign up
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm shadow-md shadow-teal-100 hover:bg-teal-600 active:scale-[0.98] transition-premium disabled:opacity-50 disabled:pointer-events-none mt-2 group"
            >
              <span>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</span>
              {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </button>

            {onDemoStart && (
              <button
                type="button"
                onClick={onDemoStart}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-700 font-semibold text-sm border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-premium"
              >
                <Sparkles size={16} className="text-teal-500" />
                <span>Try demo mode</span>
              </button>
            )}
          </form>
        </section>
        
      </div>
    </div>
  );
}
