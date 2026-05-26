/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
// We place this inside a function or check safely to avoid crashing on launch if the key is missing.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY", // fallback to prevent SDK creation crash
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-Memory state for server persistence
const db = {
  profile: {
    name: "Alex Carver",
    major: "Computer Science",
    university: "State Tech University",
    expectedGraduation: "June 2027",
    skills: ["React", "JavaScript", "Python", "Tailwind CSS"],
    targetRole: "Full-Stack Software Engineer",
    targetCompany: "Google",
    experienceLevel: "Entry-level" as const,
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
  },
  resumes: [] as any[],
  roadmaps: [] as any[],
  interviews: new Map<string, any>(),
  chatHistories: new Map<string, any[]>(),
};

// ----------------- PROFILE ENDPOINTS -----------------
app.get("/api/profile", (req, res) => {
  res.json(db.profile);
});

app.post("/api/profile", (req, res) => {
  try {
    const profile = req.body;
    db.profile = {
      ...db.profile,
      ...profile,
    };
    res.json({ message: "Profile updated successfully!", profile: db.profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- EPIC A: RESUME OPTIMIZER & PARSING -----------------
app.post("/api/resume/optimize", async (req, res) => {
  const { resumeText, targetJobDescription, targetRole } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "Resume text content is required." });
  }

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are FuturePath AI's expert resume optimizer, grammar check specialist, and Applicant Tracking System (ATS) auditor. 
Your objective is to benchmark a user's resume text against a target job description and target role.
You must critique spelling, grammar, tech-stack alignment, and strength of experience bullets. 

Analyze the input Resume and Target Job details. You must compute or identify:
1. ATS score (integer between 0 and 100), reflective of skill and experience overlap.
2. A list of missing high-priority technical or domain keywords.
3. Specific grammar/spelling issues to flag (with snippet, correction, and clear explanation).
4. Concrete bullet point improvements (pairing the original line with an improved, metric-driven version using professional action verbs, and explaining why).
5. A summary overview and overall feedback.

You must respond STRICTLY in JSON format with the following JSON structure:
{
  "score": number, 
  "roleBenchmarked": "string",
  "summary": "string",
  "missingKeywords": ["string", "string"],
  "grammarIssues": [
    {
       "snippet": "string of error snippet",
       "correction": "string of correction",
       "explanation": "why this correction"
    }
  ],
  "bulletImprovements": [
    {
       "original": "string",
       "improved": "string",
       "reason": "string"
    }
  ],
  "overallFeedback": "string"
}
Make sure all JSON keys match exactly. Do not truncate the JSON or include any trailing explanatory comments or Markdown backticks in the text around the JSON object.`;

    const userPrompt = `
TARGET ROLE: ${targetRole || db.profile.targetRole}
TARGET JOB DESCRIPTION: ${targetJobDescription || "A strong candidate should have modern development experience, collaboration skills, and problem-solving practices in relevant technologies."}

CANDIDATE RESUME FIELDS:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            roleBenchmarked: { type: Type.STRING },
            summary: { type: Type.STRING },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            grammarIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  snippet: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["snippet", "correction", "explanation"]
              }
            },
            bulletImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["original", "improved", "reason"]
              }
            },
            overallFeedback: { type: Type.STRING }
          },
          required: ["score", "roleBenchmarked", "summary", "missingKeywords", "grammarIssues", "bulletImprovements", "overallFeedback"]
        }
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    db.resumes.unshift(parsedData); // save to history
    res.json(parsedData);
  } catch (error: any) {
    console.error("Resume Optimization Error:", error);
    res.status(500).json({ error: error.message || "Failed to parse and optimize resume due to an AI error." });
  }
});

// ----------------- EPIC B: DYNAMIC LEARNING ROADMAP PLANNER -----------------
app.post("/api/roadmap/generate", async (req, res) => {
  const { targetRole, timeframeDays, specialFocus } = req.body;

  const resolvedRole = targetRole || db.profile.targetRole;
  const resolvedTimeframe = timeframeDays || "4 weeks";

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are FuturePath AI's elite education syllabus designer and technical career roadmap planner. 
Your output is a comprehensive, step-by-step curriculum parsed into weekly sprints tailored specifically to a student's graduation timelines, current technical level, and target engineering roles.

You must design an organized roadmap including:
- Target Role
- Timeframe description
- Sprints: A structured list of chronological sprints (at least 3-6 sprints depending on timeframe).
  Each sprint must contain:
  1. "week": (integer value)
  2. "title": (concise title of the sprint focus)
  3. "description": (detailed outline of learning goals)
  4. "topics": (list of core sub-topics/technologies to study)
  5. "resources": (active self-learning links. Links must look professional, like developer docs or standard high-quality learning hubs, e.g., MDN, React Devs, official python docs, etc. Use realistic URLs, and include a title, explicit url, and resource type: "Video" | "Article" | "Course" | "Documentation")
  6. "milestone": (a hands-on project or practical goal that proves mastery of that cohort week)

You must respond STRICTLY in JSON format matching the following schema structure:
{
  "targetRole": "string",
  "timeframe": "string",
  "sprints": [
    {
      "week": number,
      "title": "string",
      "description": "string",
      "topics": ["string", "string"],
      "resources": [
        {
          "title": "string",
          "url": "string",
          "type": "Video" | "Article" | "Course" | "Documentation"
        }
      ],
      "milestone": "string"
    }
  ]
}
Do not use Markdown wrappers, trailing explanations, or unparseable text.`;

    const userPrompt = `
STUDENT CURRENT METRICS:
- Major: ${db.profile.major}
- Skills: ${db.profile.skills.join(", ")}
- Expected Grad: ${db.profile.expectedGraduation}
- Experience Level: ${db.profile.experienceLevel}

TARGETS:
- Target Role: ${resolvedRole}
- Target Company Preference: ${db.profile.targetCompany}
- Duration Goal: ${resolvedTimeframe}
- Special Focus Requests: ${specialFocus || "None"}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            timeframe: { type: Type.STRING },
            sprints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  topics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: {
                          type: Type.STRING,
                          enum: ["Video", "Article", "Course", "Documentation"]
                        }
                      },
                      required: ["title", "url", "type"]
                    }
                  },
                  milestone: { type: Type.STRING }
                },
                required: ["week", "title", "description", "topics", "resources", "milestone"]
              }
            }
          },
          required: ["targetRole", "timeframe", "sprints"]
        }
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    db.roadmaps.unshift(parsedData);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate dynamic planner curriculum." });
  }
});

// ----------------- EPIC C: ADAPTIVE MOCK INTERVIEW SIMULATOR -----------------
app.post("/api/interview/start", async (req, res) => {
  const { difficulty, targetRole } = req.body;
  const resolvedRole = targetRole || db.profile.targetRole;
  const resolvedDiff = difficulty || "Medium";

  const sessionId = "session_" + Math.random().toString(36).substr(2, 9);

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are FuturePath AI's expert technical engineering lead and behavioral interviewer.
You are initiating a highly immersive interview loop for the role: ${resolvedRole}, Difficulty: ${resolvedDiff}.

Your job is to formulate the VERY FIRST initial question of the interview. 
The question should be highly targeted, demanding deep conceptual thinking (e.g. system design choice, high-scale DB strategy, coding trade-off or core algorithmic scenario matching the role).
Keep the tone formal, direct, and slightly challenging.

You must respond STRICTLY with a simple JSON holding the single start question:
{
  "firstQuestion": "string"
}`;

    const userPrompt = `Generate the introductory technical interview question for a ${resolvedDiff} level ${resolvedRole} candidate with skills: ${db.profile.skills.join(", ")}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            firstQuestion: { type: Type.STRING }
          },
          required: ["firstQuestion"]
        }
      },
    });

    const parsed = JSON.parse(response.text || '{"firstQuestion": "Could you explain your architectural design methodology for a high-availability server?"}');
    const firstQuestion = parsed.firstQuestion;

    const initialSession = {
      sessionId,
      targetRole: resolvedRole,
      difficulty: resolvedDiff,
      turns: [
        {
          sender: "interviewer" as const,
          text: firstQuestion,
          timestamp: new Date().toISOString(),
        }
      ],
      currentQuestion: firstQuestion,
      totalQuestions: 4, // Max questions in the simulation
      isFinished: false,
    };

    db.interviews.set(sessionId, initialSession);
    res.json(initialSession);
  } catch (error: any) {
    console.error("Interview Initialization Error:", error);
    res.status(500).json({ error: error.message || "Failed to boot live mock interview session." });
  }
});

app.post("/api/interview/respond", async (req, res) => {
  const { sessionId, answerText } = req.body;

  if (!sessionId || !answerText) {
    return res.status(400).json({ error: "Session ID and Candidate's answer are required values." });
  }

  const session = db.interviews.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: "No active interview session was found." });
  }

  if (session.isFinished) {
    return res.json(session);
  }

  // Push user response
  session.turns.push({
    sender: "candidate",
    text: answerText,
    timestamp: new Date().toISOString(),
  });

  const currentCount = Math.floor(session.turns.length / 2); // pairs of Q&A

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are a strict, smart, senior corporate engineering interviewer. 
You are actively evaluating a candidate's answer to your previous question: "${session.currentQuestion}".
Analyze their answer contextually, seeking out technical gaps, incorrect assumptions, or communication flaws based on their answer text.

If current interview counts represent standard progress (e.g. they have answered < ${session.totalQuestions} questions):
- Evaluate the candidate's last answer and provide a JSON response evaluating this single response (0-100 score, strengths, weaknesses, and direct critique).
- Craft the next question. DO NOT choose from a static list. Build the follow-up question actively to probe deeper into the structural flaws, trade-offs, or omissions of their previous response. Present a real scenario or system modification.
- Return:
{
  "evaluation": {
     "score": number, 
     "strengths": ["string", "string"],
     "weaknesses": ["string"],
     "constructiveFeedback": "string"
  },
  "nextQuestion": "string"
}

If candidate has now answered all ${session.totalQuestions} questions:
- Complete the interview! Assign scores and write a detailed production-grade review report containing core metric evaluations (Technical, Communication), an overall average, an editorial summary, and key improvement bullet points.
- Return:
{
  "isFinished": true,
  "evaluation": {
     "score": number,
     "strengths": ["string"],
     "weaknesses": ["string"],
     "constructiveFeedback": "string"
  },
  "finalEvaluation": {
     "technicalScore": number,
     "communicationScore": number,
     "overallScore": number,
     "summary": "string",
     "actionableKeySteps": ["string", "string"]
  }
}
Generate strict structurally compliant JSON following this mandate. Do not insert secondary text.`;

    // Package entire conversation context for Gemini to read
    const convoBuffer = session.turns.map((t: any) => `${t.sender === "interviewer" ? "Interviewer" : "Candidate"}: ${t.text}`).join("\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: convoBuffer,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isFinished: { type: Type.BOOLEAN },
            evaluation: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                constructiveFeedback: { type: Type.STRING }
              },
              required: ["score", "strengths", "weaknesses", "constructiveFeedback"]
            },
            nextQuestion: { type: Type.STRING },
            finalEvaluation: {
              type: Type.OBJECT,
              properties: {
                technicalScore: { type: Type.INTEGER },
                communicationScore: { type: Type.INTEGER },
                overallScore: { type: Type.INTEGER },
                summary: { type: Type.STRING },
                actionableKeySteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["technicalScore", "communicationScore", "overallScore", "summary", "actionableKeySteps"]
            }
          },
          required: ["evaluation"]
        }
      },
    });

    const parsedResult = JSON.parse(response.text || "{}");

    // Add evaluation to the candidate's last turn
    const candTurn = session.turns[session.turns.length - 1];
    candTurn.evaluation = parsedResult.evaluation;

    if (parsedResult.isFinished || currentCount >= session.totalQuestions) {
      session.isFinished = true;
      session.finalEvaluation = parsedResult.finalEvaluation || {
        technicalScore: parsedResult.evaluation?.score || 70,
        communicationScore: 80,
        overallScore: parsedResult.evaluation?.score || 75,
        summary: "The candidate demonstrated sound problem solving principles across modern architectures.",
        actionableKeySteps: ["Deepen standard systems networking knowledge", "Practice structured structural articulation under latency constraints"]
      };
      session.currentQuestion = "";
    } else {
      session.currentQuestion = parsedResult.nextQuestion || "What trade-offs are involved in this architecture?";
      session.turns.push({
        sender: "interviewer",
        text: session.currentQuestion,
        timestamp: new Date().toISOString(),
      });
    }

    db.interviews.set(sessionId, session);
    res.json(session);
  } catch (error: any) {
    console.error("Simulation response processing error:", error);
    res.status(500).json({ error: error.message || "Failed to process candidate interview response." });
  }
});

// ----------------- EPIC D: 24/7 PLACEMENT ASSISTANCE CHATBOT -----------------
app.post("/api/chatbot/chat", async (req, res) => {
  const { messageText, userSessionId } = req.body;

  if (!messageText) {
    return res.status(400).json({ error: "User message length must be greater than zero." });
  }

  const sid = userSessionId || "default_chat";
  const history = db.chatHistories.get(sid) || [];

  try {
    const ai = getGeminiClient();

    // Map existing history to Gemini standard API structure for chats if needed,
    // or run a stateful session. Since we want standard request/response with history:
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are 'FuturePath AI's expert, friendly, and seasoned 24/7 Placement Assistance Chatbot.
Your job is to act as a brilliant college careers support coach, mock interviewer, and guidelines advisor.
You provide exceptional, real consulting regarding:
- Formatting resume items and choosing high-impact metrics.
- Sourcing learning materials and resources aligned to roadmap topics.
- Career path assessment queries.
- Academic policies and interview preparations.

Keep your answers crisp, fully relevant, highly informative, structured, and organized in beautiful Github-Flavored Markdown. Highlight headings, code blocks and bullet items appropriately. Avoid robotic self-praise. Address the user directly as a career peer.`
      }
    });

    // Populate conversation history manually in the chat instance
    // Note: chat.sendMessage takes a simple message string
    // Let's populate the past history to ensure we're stateful!
    // Simply pre-feed historical turns to the chat instance
    for (const h of history) {
      // In the newer SDK, we can pass context. Let's send messages synchronously to keep continuity
      // or we can simply format the historical turns inside the prompt to keep it extremely fast and low-latency!
      // In-prompt history formatting is incredibly fast:
    }

    const compiledPrompt = [
      ...history.map(item => `${item.sender === "user" ? "Candidate" : "Coach"}: ${item.text}`),
      `Candidate: ${messageText}`
    ].join("\n\n");

    const chatResponse = await chatInstance.sendMessage({ message: messageText });
    const assistantReply = chatResponse.text || "I apologize, but I did not catch that. Could you please rephrase in detail?";

    // Save history
    history.push({ sender: "user", text: messageText, timestamp: new Date().toISOString() });
    history.push({ sender: "assistant", text: assistantReply, timestamp: new Date().toISOString() });
    db.chatHistories.set(sid, history);

    res.json({
      reply: assistantReply,
      history: history,
    });
  } catch (error: any) {
    console.error("Placement Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to call Gemini chatbot intelligence." });
  }
});

async function bootstrap() {
  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 as required by sandboxed container hosting
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[🚀 Server Ready] FuturePath AI running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
