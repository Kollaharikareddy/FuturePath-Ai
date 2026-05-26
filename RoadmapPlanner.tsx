/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StudentProfile } from "../types";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Building, 
  Code, 
  Save, 
  Edit3, 
  Plus, 
  Trash, 
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";

interface ProfileDashboardProps {
  profile: StudentProfile;
  onUpdate: (updated: StudentProfile) => void;
}

export default function ProfileDashboard({ profile, onUpdate }: ProfileDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [newSkill, setNewSkill] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onUpdate(data.profile);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Accent */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-900/40 rounded-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Career Mentoring Active
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-slate-400 max-w-xl">
              Track your career readiness scorecard, design dynamic syllabi, and practice high-fidelity mock interviews targeted at your dream tech goals.
            </p>
          </div>
          <div className="flex shrink-0">
            {!isEditing ? (
              <button
                id="edit-profile-btn"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 transition-colors text-white rounded-xl shadow-lg border border-indigo-500/30 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile Setup
              </button>
            ) : (
              <button
                id="cancel-profile-btn"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-4 rounded-xl">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Your FuturePath profile has been synchronised perfectly!</span>
        </div>
      )}

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Column Profile Views */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">Modify Professional Objectives</h2>
                <p className="text-xs text-slate-400 mt-1">These variables directly tailor the AI resume optimize criteria and roadmap generation algorithms.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Major / Specialisation</label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Academic Institution / University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Expected Graduation Date</label>
                  <input
                    type="text"
                    name="expectedGraduation"
                    value={formData.expectedGraduation}
                    onChange={handleInputChange}
                    placeholder="e.g. June 2027"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Target Engineer/Science Role</label>
                  <input
                    type="text"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Target Company Goal</label>
                  <input
                    type="text"
                    name="targetCompany"
                    value={formData.targetCompany}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Role Tier / Grade</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-950"
                  >
                    <option value="Internship">Internship (Co-op)</option>
                    <option value="Entry-level">Entry-level / Grad Associate</option>
                    <option value="Mid-level">Mid-level (1-3 yrs experience)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">GitHub Portfolio Link</label>
                  <input
                    type="text"
                    name="githubUrl"
                    value={formData.githubUrl || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://github.com/alex"
                  />
                </div>
              </div>

              {/* Skills Setup */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Core Tech Competencies & Tech Stack</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., Kubernetes, Docker, Go, AWS"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No credentials added yet. Enter critical skills above.</span>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  id="save-profile-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors text-white rounded-xl shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Changes Object
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Profile Card Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" />
                    Student Academic & Placement Persona
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0 text-slate-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Degree & Specialisation</span>
                      <span className="text-sm font-bold text-slate-200">{profile.major}</span>
                      <span className="block text-xs text-slate-400">{profile.university}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0 text-slate-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Graduation Horizon</span>
                      <span className="text-sm font-bold text-slate-200">{profile.expectedGraduation}</span>
                      <span className="block text-xs text-slate-400">Graduation Cohort</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0 text-slate-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Target Role Preference</span>
                      <span className="text-sm font-bold text-slate-200">{profile.targetRole}</span>
                      <span className="block text-xs text-slate-400">{profile.experienceLevel} Tier</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0 text-slate-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Target Corporations</span>
                      <span className="text-sm font-bold text-slate-200">{profile.targetCompany}</span>
                      <span className="block text-xs text-slate-400">Dream Tech Placement Link</span>
                    </div>
                  </div>
                </div>

                {/* Tech Badges list */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-slate-400" />
                    Demonstrated Tech Stack & Skillset
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length === 0 && (
                      <span className="text-xs text-slate-500 italic">No competencies described. Hit edit profile setup above to append systems.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column - Quick Action Stats & Progress Metrics */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Placement Milestones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
                <div>
                  <span className="block text-xs font-medium text-slate-300">Resume Tailor Status</span>
                  <span className="text-[10px] text-slate-500">Optimised for ATS</span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
                <div>
                  <span className="block text-xs font-medium text-slate-300">Curricula Plan Roadmap</span>
                  <span className="text-[10px] text-slate-500">Milestone curriculum setup</span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
                <div>
                  <span className="block text-xs font-medium text-slate-300">Technical Communication Loops</span>
                  <span className="text-[10px] text-slate-500">Aggressive Mock Feedback</span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  Pending practice
                </span>
              </div>
            </div>
          </div>

          {/* Quick AI Coaching Tips */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">Daily Career Advisory</h4>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                🎯 Modern resumes score highest in ATS scanners when metric ratios are quantified (e.g. "reduced server latency by <strong className="text-indigo-400">35%</strong> using Redis caches" is 3x more effective than "built cache layer").
              </p>
              <p className="text-[10px] text-slate-500">
                — FuturePath AI Career Principal Coach
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
