import React, { useEffect, useState } from "react";
import {
  Check,
  Edit3,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  User,
  UserRound,
  X,
} from "lucide-react";

export function ProfileSection({
  user,
  onLogout,
  onProfileUpdate,
  onPasswordChange,
  loading,
}) {
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [localMessage, setLocalMessage] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setLocalMessage("");
    try {
      await onProfileUpdate(profileForm);
      setEditing(false);
    } catch (_error) {
      setLocalMessage("Profile could not be updated. Please check the details and try again.");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setLocalMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setLocalMessage("New passwords do not match.");
      return;
    }

    try {
      await onPasswordChange({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordOpen(false);
    } catch (_error) {
      setLocalMessage("Password could not be changed. Please check your current password.");
    }
  };

  const handleCancelEdit = () => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
    });
    setEditing(false);
    setLocalMessage("");
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  return (
    <section className="space-y-6">
      {/* Profile Cover Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-600 rounded-[16px] p-6 md:p-8 text-white shadow-premium">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-outfit shadow-lg shrink-0">
            <User size={40} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold font-outfit tracking-tight">
              {user?.name || "User"}
            </h1>
            <p className="text-teal-50 text-xs md:text-sm mt-1 font-medium">
              {user?.email || "No email available"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {(localMessage || loading.message) && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold border ${
            localMessage
              ? "bg-rose-50 border-rose-100 text-rose-700"
              : "bg-emerald-50 border-emerald-100 text-emerald-700"
          }`}
        >
          {localMessage || loading.message}
        </div>
      )}

      {/* Form Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Info Card */}
        <article className="bg-white border border-slate-100 p-6 rounded-[16px] shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <UserRound size={16} className="text-teal-500" />
                <h3>Personal Information</h3>
              </div>
              {editing ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCancelEdit}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Cancel edit"
                  >
                    <X size={15} />
                  </button>
                  <button
                    type="submit"
                    form="profile-edit-form"
                    disabled={loading.profile}
                    className="p-1.5 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                    title="Save changes"
                  >
                    <Check size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 py-1 px-3 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <form id="profile-edit-form" onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                {editing ? (
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((current) => ({ ...current, name: e.target.value }))}
                    minLength={2}
                    maxLength={60}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                  />
                ) : (
                  <strong className="text-sm font-bold text-slate-800">
                    {user?.name || "User"}
                  </strong>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((current) => ({ ...current, email: e.target.value }))}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                  />
                ) : (
                  <strong className="text-sm font-bold text-slate-800">
                    {user?.email || "No email available"}
                  </strong>
                )}
              </div>
            </form>
          </div>
        </article>

        {/* Security / Password Card */}
        <article className="bg-white border border-slate-100 p-6 rounded-[16px] shadow-premium flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <LockKeyhole size={16} className="text-teal-500" />
                <h3>Account Security</h3>
              </div>
            </div>

            <button
              onClick={() => setPasswordOpen(!passwordOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 active:scale-95 transition-premium mb-4"
            >
              <LockKeyhole size={14} />
              <span>{passwordOpen ? "Close Password Form" : "Change Password"}</span>
            </button>

            {passwordOpen && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={visiblePasswords.currentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {visiblePasswords.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={visiblePasswords.newPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {visiblePasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={visiblePasswords.confirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-premium text-sm bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {visiblePasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.password}
                  className="w-full px-4 py-2 rounded-xl bg-teal-500 text-white font-semibold text-xs hover:bg-teal-600 shadow-sm active:scale-95 transition-premium"
                >
                  Save Password
                </button>
              </form>
            )}

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-50 active:scale-95 transition-premium"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold border-t border-slate-50 pt-4">
            <Mail size={14} />
            <span>Signed in as {user?.email || "your account"}</span>
          </div>
        </article>

      </div>
    </section>
  );
}
