/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Roadmap, RoadmapSprint } from "../types";
import { 
  Map, 
  Send, 
  Loader2, 
  BookOpen, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Award,
  Video,
  FileText,
  BookmarkCheck,
  CheckSquare,
  Square
} from "lucide-react";

interface RoadmapPlannerProps {
  targetRole: string;
}

export default function RoadmapPlanner({ targetRole }: RoadmapPlannerProps) {
  const [timeframe, setTimeframe] = useState("6 weeks");
  const [specialFocus, setSpecialFocus] = useState("");
  const [customRole, setCustomRole] = useState(targetRole);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: customRole,
          timeframeDays: timeframe,
          specialFocus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to craft roadmap. Please try again.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRoadmap(data);
      setCompletedWeeks([]); // reset checkbox registry
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during roadmap generation.");
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekCompletion = (weekNum: number) => {
    setCompletedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleSampleLoad = () => {
    setRoadmap({
      targetRole: "Full-Stack Software Engineer (React / Python focus)",
      timeframe: "4 weeks fast-track",
      sprints: [
        {
          week: 1,
          title: "Frontend Architecture & Tailwind Mastery",
          description: "Establish a robust responsive UI environment. Build reusable component trees, optimize rendering, and style layout bento sheets cleanly with modern Tailwind utility classes.",
          topics: [
            "React functional component layouts and hook cycles",
            "Tailwind v4 responsive wrappers, grid matrices, custom themes",
            "State management synchronization via Context arrays"
          ],
          resources: [
            { title: "React Devs - Modern State Guides", url: "https://react.dev", type: "Documentation" },
            { title: "Responsive Tailwind Grid Cheat sheets", url: "https://tailwindcss.com", type: "Documentation" }
          ],
          milestone: "Construct a responsive career dashboard portfolio showcasing grid items cleanly."
        },
        {
          week: 2,
          title: "Backend Microservices & REST Controller Setup",
          description: "Transition logic to application servers. Implement robust Express routing middleware, define robust schema rules, and handle environment credentials securely.",
          topics: [
            "CJS/ESM compilation setup in Node.js pipelines",
            "Request processing body validation protocols",
            "Middleware pipelines for security credentials headers"
          ],
          resources: [
            { title: "Express.js Guide - Route Architecture", url: "https://expressjs.com", type: "Documentation" },
            { title: "Fast REST API Engineering Courses", url: "https://youtube.com", type: "Video" }
          ],
          milestone: "Implement an Express API endpoint handling complex secure user session state."
        },
        {
          week: 3,
          title: "Gemini Model Selection & Context Windows",
          description: "Inject generative artificial intelligence mechanisms securely. Design rich prompt layouts, structure responses using JSON Schemas, and manage user chat history context boundaries.",
          topics: [
            "Official @google/genai SDK setup frameworks",
            "Designing reliable response schemas with Type definitions",
            "Implementing low-latency content streams for chat controllers"
          ],
          resources: [
            { title: "Google GenAI SDK Documentation Rules", url: "https://ai.google.dev", type: "Documentation" }
          ],
          milestone: "Connect your backend Express handlers to stream continuous Gemini reasoning chunks back safely."
        },
        {
          week: 4,
          title: "Deployment & Production Performance Bundling",
          description: "Prepare the complete React + Express full-stack ecosystem for container deployment. Setup build bundlers (esbuild, vite) and configure environment properties.",
          topics: [
            "Vite production file asset minimization",
            "Bundling Express TypeScript into a single server.cjs using esbuild",
            "Cloud Run and environment variable mapping"
          ],
          resources: [
            { title: "Vite Bundler Production Guidelines", url: "https://vite.dev", type: "Documentation" }
          ],
          milestone: "Establish a unified container build mapping port inputs safely on Cloud ports."
        }
      ]
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-3.5 h-3.5 text-red-400" />;
      case "Article":
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case "Course":
        return <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Description header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Map className="w-5.5 h-5.5 text-indigo-400" />
          Epic B: Dynamic Personal Learning Roadmap Planner
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Generate a tailored hyper-personalized timeline curriculum. Specify your goal timeframe and target focus areas to map out deep chronological weekly sprints, structured syllabus checklists, hands-on master milestones, and active learning resources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Controls */}
        <form onSubmit={handleGenerate} className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-semibold uppercase text-slate-300">Planner Configuration</h3>
            <button
              type="button"
              onClick={handleSampleLoad}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Load Ideal Quick Path
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Target Engineering Target</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Full-Stack Dev (React / Cloud)"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Goal Horizon Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-950"
              >
                <option value="4 weeks">4 Weeks (Fast-track Sprint)</option>
                <option value="6 weeks">6 Weeks (Standard Foundations)</option>
                <option value="8 weeks">8 Weeks (Comprehensive Career Prep)</option>
                <option value="12 weeks">12 Weeks (Zero to Job-Ready Hero)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Special Focus Area / Technologies (Optional)</label>
              <input
                type="text"
                value={specialFocus}
                onChange={(e) => setSpecialFocus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g., GCP, Docker, Kubernetes system designs"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/15 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="generate-roadmap-btn"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors rounded-xl shadow-lg shadow-indigo-950/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Syllabus Architecture Engines Booting...
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                Assemble Personalized Syllabus
              </>
            )}
          </button>
        </form>

        {/* Right Roadmap Column */}
        <div className="lg:col-span-8">
          {!roadmap && !loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-slate-950 rounded-full border border-slate-800 text-slate-500 shadow-inner">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-200">No curriculum mapped</h3>
                <p className="text-xs text-slate-500">
                  Select your timeline parameters and trigger the planner to generate an automated tech study regime integrated with live milestones.
                </p>
              </div>
            </div>
          ) : roadmap && !loading ? (
            <div className="space-y-6">

              {/* Progress Summary Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Real-time Curriculum Progress</span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5">{roadmap.targetRole} Dynamic Study Plan</h3>
                  <p className="text-xs text-slate-400">Paced for {roadmap.timeframe}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full sm:w-48 text-center sm:text-right space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Weeks Finished:</span>
                    <span className="font-bold text-emerald-400">{completedWeeks.length} / {roadmap.sprints.length}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${(completedWeeks.length / roadmap.sprints.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Chromatographic Sprints List */}
              <div className="relative border-l border-slate-800/80 ml-4 pl-6 space-y-8">
                {roadmap.sprints.map((sprint) => {
                  const isCompleted = completedWeeks.includes(sprint.week);
                  return (
                    <div key={sprint.week} className="relative">
                      {/* Timeline dot badge */}
                      <button
                        id={`complete-week-${sprint.week}`}
                        onClick={() => toggleWeekCompletion(sprint.week)}
                        className={`absolute -left-[37px] top-1.5 w-[22px] h-[22px] rounded-full border flex items-center justify-center transition-all cursor-pointer ${isCompleted ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800'}`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-3.5 h-3.5 stroke-[3px]" />
                        ) : (
                          <span className="text-[10px] font-bold font-mono">{sprint.week}</span>
                        )}
                      </button>

                      {/* Card block */}
                      <div className={`p-5 rounded-2xl bg-slate-900 border transition-all ${isCompleted ? 'border-emerald-500/20 bg-slate-900/50' : 'border-slate-800/90'}`}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Cohort Week {sprint.week}</span>
                            <h3 className={`text-base font-bold mt-0.5 ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                              {sprint.title}
                            </h3>
                          </div>
                          <button
                            onClick={() => toggleWeekCompletion(sprint.week)}
                            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200'}`}
                          >
                            {isCompleted ? "Completed" : "Mark Done"}
                          </button>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{sprint.description}</p>

                        {/* Topics nested checklist */}
                        <div className="mt-4 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Syllabus Focus Items:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {sprint.topics.map((topic, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/60 font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Active Learning resources */}
                        <div className="mt-4 pt-4 border-t border-slate-850">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Self-Learning Direct Modules:</span>
                          <div className="flex flex-wrap gap-2">
                            {sprint.resources.map((resItem, i) => (
                              <a
                                key={i}
                                href={resItem.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-850 text-xs text-slate-300 hover:text-indigo-400 rounded-xl transition-colors shrink-0"
                              >
                                {getResourceIcon(resItem.type)}
                                <span className="font-medium max-w-[150px] truncate">{resItem.title}</span>
                                <span className="text-[9px] text-slate-500 uppercase">({resItem.type})</span>
                                <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Practical hands-on milestone */}
                        <div className="mt-4 p-3 bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 rounded-xl flex items-start gap-2">
                          <Award className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block text-indigo-300">Practical Weekly Milestone:</span>
                            <span className="text-xs text-slate-300 leading-relaxed font-sans mt-0.5 block">{sprint.milestone}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
