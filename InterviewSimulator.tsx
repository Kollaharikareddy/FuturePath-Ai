/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ResumeFeedback } from "../types";
import { 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Award, 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  RotateCcw,
  Code2
} from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts";

interface ResumeOptimizerProps {
  targetRole: string;
}

export default function ResumeOptimizer({ targetRole }: ResumeOptimizerProps) {
  const [resumeText, setResumeText] = useState("");
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [customRole, setCustomRole] = useState(targetRole);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "keywords" | "grammar" | "bullets">("overview");

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetJobDescription,
          targetRole: customRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process resume. Please try again.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setFeedback(data);
      setActiveSubTab("overview");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLoad = () => {
    setResumeText(`ALEX CARVER
alex.carver@statetech.edu | (555) 019-2834
State Tech University, expected B.S. in Computer Science

EDUCATION
B.S. Computer Science - GPA: 3.4
Relevant modules: Web Design, Algorithms, Database Systems

EXPERIENCE
Frontend Intern - TechLabs (June 2024 - Sept 2024)
- Made some React pages for internal tools.
- Did bug fixing in the code and worked on JS files.
- Talked to product managers about specifications.

Projects:
- Todo Dashboard: Built an app to track user checklist items with database backing. Used JavaScript and Express.
- Movie Database app: Fetched movies from public endpoint to show catalogs.

TECHNICAL SKILLS:
React, HTML, CSS, JavaScript, Node.js, Git`);

    setTargetJobDescription(`Title: Junior Software Engineer (Full-Stack)
Company: NextGen Systems
We are seeking a high-potential Associate Software Engineer to join our core product crew.
Key Responsibilities:
- Architect robust features using React.js, TypeScript, and Tailwind CSS.
- Build performant microservices and server controllers with Node.js and Docker containers.
- Work closely in an agile environment collaborating with designers on standard systems APIs.
Required tech skills: TypeScript, React, Node.js, TailWind, Docker, SQL Databases, CI/CD pipelines.`);
  };

  // Process data for charts
  const radialData = feedback ? [
    {
      name: 'ATS Score',
      value: feedback.score,
      fill: feedback.score >= 80 ? '#10B981' : feedback.score >= 60 ? '#F59E0B' : '#EF4444',
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top Description Pane */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5.5 h-5.5 text-indigo-400" />
          Epic A: AI Resume Optimizer & ATS Benchmark Engine
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Benchmark your resume profile semantically against target role prerequisites. Extract high-priority tech keywords, highlight immediate grammatical errors, and get fully metric-polished resume statements engineered to score in modern applicant tracking algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input form (5 Column grid) */}
        {!feedback || loading ? (
          <form onSubmit={handleOptimize} className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Analysis Input Console</h3>
              <button
                type="button"
                onClick={handleSampleLoad}
                className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Candidate Data
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Target Engineering Role</label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Associate Full-Stack Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Paste Raw Resume Text</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                  placeholder="Copy and paste your markdown, plain text, or PDF content strings directly here..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Target Job Description (Optional)</label>
                <textarea
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  className="w-full h-36 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="Paste the company listing rules or JD description benchmarks to allow precise semantic keyword highlighting..."
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 text-red-400 border border-red-500/15 p-3 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              id="analyze-resume-btn"
              disabled={loading || !resumeText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors rounded-xl shadow-lg shadow-indigo-950/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Triggering Multi-Modal ATS Scanning...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Perform Deep Semantic Benchmark
                </>
              )}
            </button>
          </form>
        ) : (
          /* Small summary block under results to perform new optimize searches */
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Scanning Parameters</h3>
              <p className="text-xs text-slate-500 mt-1">Currently evaluating profile benchmarks.</p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Role Benchmark</span>
                <p className="text-slate-200 font-bold">{feedback.roleBenchmarked}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">SLA Status Code</span>
                <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Checked & Optimized
                </p>
              </div>
            </div>

            <button
              onClick={() => setFeedback(null)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Scan Another Resume
            </button>
          </div>
        )}

        {/* Right Outputs section: 7 columns or full width of results (8 columns) */}
        <div className={feedback && !loading ? "lg:col-span-8 space-y-6" : "lg:col-span-7"}>
          {!feedback && !loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-slate-950 rounded-full border border-slate-800 text-slate-500 shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-200">No active scan profile detected</h3>
                <p className="text-xs text-slate-500">
                  Fill in your resume metrics and click analyze to compute your match percentages, technologies required, and grammar flags.
                </p>
              </div>
            </div>
          ) : feedback && !loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              {/* Score and Core Metrics header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  {/* Gauge indicator */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <span className={`text-2xl font-bold font-mono ${feedback.score >= 80 ? 'text-emerald-400' : feedback.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {feedback.score}%
                    </span>
                    <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                    <div className={`absolute inset-0 border-4 rounded-full ${feedback.score >= 80 ? 'border-emerald-500' : feedback.score >= 60 ? 'border-amber-500' : 'border-red-500'} animate-pulse`} style={{ clipPath: `inset(${(100 - feedback.score)}% 0px 0px 0px)` }}></div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">ATS Score Metric</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      Career Alignment Index
                      <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Benchmarked for <strong className="text-slate-200">{feedback.roleBenchmarked}</strong></p>
                  </div>
                </div>

                <div className="text-center sm:text-right space-y-1">
                  <span className="text-xs text-slate-400 block">System Fit Rating:</span>
                  <span className={`px-3 py-1 bg-slate-950 font-bold rounded-xl text-xs border ${feedback.score >= 80 ? 'text-emerald-400 border-emerald-500/20' : feedback.score >= 60 ? 'text-amber-400 border-amber-500/20' : 'text-red-400 border-red-400/20'}`}>
                    {feedback.score >= 80 ? 'HIGH MATCH' : feedback.score >= 60 ? 'MODERATE FIT' : 'URGENT POLISH REQ.'}
                  </span>
                </div>
              </div>

              {/* Sub tabs selectors */}
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-850 gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveSubTab("overview")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap px-3 ${activeSubTab === "overview" ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Feedback Summary
                </button>
                <button
                  onClick={() => setActiveSubTab("keywords")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap px-3 ${activeSubTab === "keywords" ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Missing Keywords ({feedback.missingKeywords.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("grammar")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap px-3 ${activeSubTab === "grammar" ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Grammar Audit ({feedback.grammarIssues.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("bullets")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap px-3 ${activeSubTab === "bullets" ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Polished Bullet Sprints ({feedback.bulletImprovements.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[200px]">
                
                {/* 1. Overview */}
                {activeSubTab === "overview" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Executive Summary</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{feedback.summary}</p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Advisor Outlook</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{feedback.overallFeedback}</p>
                    </div>
                  </div>
                )}

                {/* 2. Missing Keywords */}
                {activeSubTab === "keywords" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-500/5 text-amber-400 border border-amber-500/15 rounded-xl text-xs flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>These key technologies and keywords were highlighted in the target JD but missing or extremely weak in your resume. Integrating these will dramatically lift your automated score.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {feedback.missingKeywords.map((tag) => (
                        <div key={tag} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-2 shadow-inner">
                          <span className="text-xs font-bold text-slate-200">{tag}</span>
                          <Code2 className="w-4 h-4 text-slate-500" />
                        </div>
                      ))}
                      {feedback.missingKeywords.length === 0 && (
                        <div className="col-span-full py-6 text-center text-xs italic text-slate-500">Perfect alignment! No missing technologies highlighted.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Grammar flag checklist */}
                {activeSubTab === "grammar" && (
                  <div className="space-y-3">
                    {feedback.grammarIssues.map((issue, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-md font-bold">Linguistic Improvement</span>
                          <span className="text-xs text-slate-400">Issue {idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="bg-red-950/20 border border-red-900/15 p-2 px-3 rounded-lg">
                            <span className="text-[10px] text-red-500 font-bold block mb-0.5">Original Snippet</span>
                            <span className="text-xs text-slate-300 font-mono italic">"{issue.snippet}"</span>
                          </div>
                          <div className="bg-emerald-950/20 border border-emerald-900/15 p-2 px-3 rounded-lg">
                            <span className="text-[10px] text-emerald-500 font-bold block mb-0.5">Automated Correction</span>
                            <span className="text-xs text-slate-200 font-bold">"{issue.correction}"</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5"><strong className="text-slate-300">Explanation:</strong> {issue.explanation}</p>
                      </div>
                    ))}

                    {feedback.grammarIssues.length === 0 && (
                      <div className="py-12 bg-slate-950 border border-slate-850 rounded-xl text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-200">Writing style and grammar look pristine!</h4>
                        <p className="text-xs text-slate-500">No spelling anomalies or syntax style violations flagged by the analyzer.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Polished metric improvements */}
                {activeSubTab === "bullets" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-500/5 text-indigo-400 border border-indigo-500/15 rounded-xl text-xs flex gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>Rewrite boring, descriptive tasks into powerful, metrics-driven professional outcome achievements tailored to impress systems engineers and hiring review targets.</p>
                    </div>

                    <div className="space-y-3.5">
                      {feedback.bulletImprovements.map((bullet, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Metric Polish Optimization {idx + 1}</span>
                          </div>

                          <div className="space-y-2.5">
                            <div className="p-2.5 bg-slate-900/50 border border-slate-850 rounded-lg">
                              <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Previous descriptive phrase</span>
                              <p className="text-xs text-slate-400 italic">"{bullet.original}"</p>
                            </div>
                            <div className="p-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                              <span className="text-[9px] text-indigo-400 font-bold block uppercase mb-1">Metric Polish (ATS Strong Output)</span>
                              <p className="text-xs text-slate-200 font-semibold font-sans leading-relaxed">"{bullet.improved}"</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-900 text-xs text-slate-400 italic">
                            <strong className="text-indigo-400/80 mr-1 not-italic">Engineered rationale:</strong> {bullet.reason}
                          </div>
                        </div>
                      ))}
                      {feedback.bulletImprovements.length === 0 && (
                        <div className="py-6 text-center text-xs italic text-slate-500">No bullet point enhancements needed.</div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
