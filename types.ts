/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StudentProfile } from "./types";
import ProfileDashboard from "./components/ProfileDashboard";
import ResumeOptimizer from "./components/ResumeOptimizer";
import RoadmapPlanner from "./components/RoadmapPlanner";
import InterviewSimulator from "./components/InterviewSimulator";
import PlacementChatbot from "./components/PlacementChatbot";
import { 
  Compass, 
  Award, 
  Map, 
  Activity, 
  MessageSquare, 
  User, 
  Briefcase, 
  Bot, 
  Sparkles,
  Info 
} from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "resume" | "roadmap" | "interview" | "chatbot">("dashboard");
  const [loading, setLoading] = useState(true);

  // Load User profile on initial mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error loading cached user profile from backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
        <p className="text-sm text-indigo-400 font-semibold uppercase tracking-wider animate-pulse">
          FuturePath AI Engine Accessing Sandbox Databases...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Top Application Ribbon Header */}
      <header className="bg-slate-900 border-b border-indigo-950/50 sticky top-0 z-55 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Platform Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-950/20">
                <Compass className="w-5.5 h-5.5 text-white animate-spin" style={{ animationDuration: '60s' }} />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  FuturePath AI
                  <span className="text-[9px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-md leading-none uppercase">v1.1</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">Smart Career Mentor sandbox</span>
              </div>
            </div>

            {/* Platform Indicators */}
            <div className="hidden md:flex items-center gap-5">
              <div className="flex items-center gap-2 text-xs bg-slate-950 p-2 px-3 rounded-xl border border-slate-900">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Targeting: <strong className="text-slate-200">{profile.targetRole}</strong> at <strong className="text-indigo-400">{profile.targetCompany}</strong></span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Primary Workspace Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs and Layout Anchors */}
        <div className="flex items-center justify-start border-b border-slate-800 pb-px overflow-x-auto gap-2 no-scrollbar scroll-smooth">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "dashboard" ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'}`}
          >
            <User className="w-4 h-4" />
            Dashboard & Profile
          </button>

          <button
            id="tab-resume"
            onClick={() => setActiveTab("resume")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "resume" ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'}`}
          >
            <Award className="w-4 h-4" />
            A: Resume Optimizer
          </button>

          <button
            id="tab-roadmap"
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "roadmap" ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'}`}
          >
            <Map className="w-4 h-4" />
            B: Learning Planner
          </button>

          <button
            id="tab-interview"
            onClick={() => setActiveTab("interview")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "interview" ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'}`}
          >
            <Activity className="w-4 h-4" />
            C: Interview Simulator
          </button>

          <button
            id="tab-chatbot"
            onClick={() => setActiveTab("chatbot")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "chatbot" ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'}`}
          >
            <MessageSquare className="w-4 h-4" />
            D: 24/7 Career Coach
          </button>
        </div>


        {/* Navigation Content Router switches */}
        <div className="min-h-[400px]">
          {activeTab === "dashboard" && (
            <ProfileDashboard profile={profile} onUpdate={handleProfileUpdate} />
          )}

          {activeTab === "resume" && (
            <ResumeOptimizer targetRole={profile.targetRole} />
          )}

          {activeTab === "roadmap" && (
            <RoadmapPlanner targetRole={profile.targetRole} />
          )}

          {activeTab === "interview" && (
            <InterviewSimulator targetRole={profile.targetRole} />
          )}

          {activeTab === "chatbot" && (
            <PlacementChatbot />
          )}
        </div>

      </main>

      {/* Platform Professional Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 FuturePath AI Inc. All rights reserved. Secure developer sandbox setup active.
          </p>
          <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-950 px-3 rounded-full border border-slate-850/60 font-mono text-[9px] text-slate-400">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>State Synchronized: REST + Gemini flash stream</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
