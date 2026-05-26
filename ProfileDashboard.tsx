/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  major: string;
  university: string;
  expectedGraduation: string;
  skills: string[];
  targetRole: string;
  targetCompany: string;
  experienceLevel: "Entry-level" | "Mid-level" | "Internship";
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface GrammarIssue {
  snippet: string;
  correction: string;
  explanation: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeFeedback {
  score: number;
  roleBenchmarked: string;
  summary: string;
  missingKeywords: string[];
  grammarIssues: GrammarIssue[];
  bulletImprovements: BulletImprovement[];
  overallFeedback: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: "Video" | "Article" | "Course" | "Documentation";
}

export interface RoadmapSprint {
  week: number;
  title: string;
  description: string;
  topics: string[];
  resources: LearningResource[];
  milestone: string;
}

export interface Roadmap {
  targetRole: string;
  timeframe: string;
  sprints: RoadmapSprint[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface InterviewTurn {
  sender: "interviewer" | "candidate";
  text: string;
  timestamp: string;
  evaluation?: {
    score: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    constructiveFeedback: string;
  };
}

export interface InterviewSession {
  sessionId: string;
  targetRole: string;
  difficulty: "Easy" | "Medium" | "Hard";
  turns: InterviewTurn[];
  currentQuestion: string;
  totalQuestions: number;
  isFinished: boolean;
  finalEvaluation?: {
    technicalScore: number;
    communicationScore: number;
    overallScore: number;
    summary: string;
    actionableKeySteps: string[];
  };
}
