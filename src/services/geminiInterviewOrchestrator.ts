import { GoogleGenAI, Type, Schema } from '@google/genai';


let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiInstance;
}


const DEFAULT_MODEL = 'gemini-2.5-pro';

export interface InterviewContext {
  language: "hi-IN" | "en-IN" | "hinglish";
  job: {
    roleTitle: string;
    businessType: string;
    businessName: string;
    city: string;
    skillsRequired: string[];
    experienceRequired: string;
    salaryRange: string;
    specialInstructions?: string;
  };
  candidate: {
    name: string;
    age?: number;
    yearsExperience: number;
    declaredSkills: string[];
    docSummary?: string;
    introKeyPoints?: string[];
  };
  conversationHistory: Array<{
    question: string;
    questionType: string;
    answerTranscript: string;
    answerKeyPoints?: string[];
    answerScore?: number;
  }>;
  coveredTopics: string[];
  redFlagsDetected: string[];
  interviewDuration: number;
  turnNumber: number;
}

export interface NextQuestionResponse {
  question: string;
  question_type: "intro" | "experience" | "skills" | "scenario" | "counter" | "pressure" | "roleplay_intro" | "salary" | "closing";
  spoken_question: string;
  language_used: "hi" | "en" | "hinglish";
  time_limit_seconds: number | null;
  show_timer: boolean;
  why_this_question: string;
  key_things_to_listen_for: string[];
  red_flag_signals: string[];
  stop_interview: boolean;
  transition_to_roleplay: boolean;
}

export interface AnswerExtraction {
  key_points: string[];
  claimed_skills: string[];
  claimed_experience: string;
  confidence_signals: string[];
  weak_points: string[];
  inconsistencies: string[];
  follow_up_needed: boolean;
  answer_quality_0_10: number;
  summary: string;
}

export interface ScorecardResponse {
  overall_score_0_100: number;
  hire_recommendation: "hire" | "maybe" | "no";
  recommendation_confidence: "high" | "medium" | "low";
  summary: string;
  summary_hindi: string;
  strengths: string[];
  concerns: string[];
  red_flags: string[];
  question_scores: Array<{
    question: string;
    answer_summary: string;
    score_0_10: number;
    notes: string;
  }>;
  score_breakdown: {
    answer_quality: number;
    experience_match: number;
    communication: number;
    body_language: number;
    documents: number;
  };
  body_language_summary: string;
  body_language_timeline: Array<{
    timestamp_seconds: number;
    confidence_score: number;
    note: string;
  }>;
  suggested_onboarding_tips: string[];
  interview_duration_minutes: number;
}

export async function getNextQuestion(context: InterviewContext): Promise<NextQuestionResponse> {
  const prompt = `You are HireGuru AI, a professional Hindi/English-speaking interviewer for Indian small businesses. You conduct natural, conversational interviews. Speak like a warm but professional Indian interviewer. Never sound robotic or corporate.

Always return ONLY valid JSON. No other text.

Generate the next interview question based on:
- The job role and requirements (Job: ${context.job.roleTitle} at ${context.job.businessName}, ${context.job.businessType} in ${context.job.city}. Req: ${context.job.skillsRequired.join(', ')}, ${context.job.experienceRequired})
- What has already been discussed (Topics covered: ${context.coveredTopics.join(', ')})
- Any inconsistencies or weak answers that need follow-up
- The candidate's declared experience and skills (Name: ${context.candidate.name}, Exp: ${context.candidate.yearsExperience} yrs)

Past Conversation:
${context.conversationHistory.map(t => `AI (${t.questionType}): ${t.question}\nCandidate: ${t.answerTranscript}`).join('\n\n')}

Question types to use strategically:
- intro: opening introduction (only Q1)
- experience: past work experience
- skills: specific skill check
- scenario: 'what would you do if...' situations
- counter: follow-up on a weak/vague previous answer
- pressure: time-sensitive question (set time_limit)
- roleplay_intro: transition to roleplay module
- salary: salary and availability (save for near end)
- closing: final question before ending

Make questions sound natural and warm. If language is Hindi, write question in Hindi script. If Hinglish, mix naturally.

Examples of natural Hindi questions:
'Pehle aap apna thoda introduction dijiye — kahan se hain, kya experience hai?'
'Ek example dijiye jab aapne kisi mushkil situation ko handle kiya ho — exactly kya hua aur aapne kya kiya?'
'Agar main aapka pehla customer hoon aur main naraaz hoon — aap mujhe exactly kya bolenge?'

Return JSON using exactly the requested schema.`;

  try {
    const response = await getAi().models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            question_type: { 
              type: Type.STRING, 
              enum: ["intro", "experience", "skills", "scenario", "counter", "pressure", "roleplay_intro", "salary", "closing"] 
            },
            spoken_question: { type: Type.STRING },
            language_used: { type: Type.STRING, enum: ["hi", "en", "hinglish"] },
            time_limit_seconds: { type: Type.NUMBER, nullable: true },
            show_timer: { type: Type.BOOLEAN },
            why_this_question: { type: Type.STRING },
            key_things_to_listen_for: { type: Type.ARRAY, items: { type: Type.STRING } },
            red_flag_signals: { type: Type.ARRAY, items: { type: Type.STRING } },
            stop_interview: { type: Type.BOOLEAN },
            transition_to_roleplay: { type: Type.BOOLEAN }
          },
          required: ["question", "question_type", "spoken_question", "language_used", "show_timer", "why_this_question", "key_things_to_listen_for", "red_flag_signals", "stop_interview", "transition_to_roleplay"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as NextQuestionResponse;
    }
  } catch (err) {
    console.error('Error generating next question:', err);
  }

  // Backup fallback
  return {
    question: "Could you tell me a little more about your work experience?",
    question_type: "experience",
    spoken_question: "Could you tell me a little more about your work experience?",
    language_used: "en",
    time_limit_seconds: null,
    show_timer: false,
    why_this_question: "Fallback due to API error",
    key_things_to_listen_for: ["Clarity", "Experience"],
    red_flag_signals: [],
    stop_interview: false,
    transition_to_roleplay: false
  };
}

export async function extractAnswerKeyPoints(question: string, answerTranscript: string, language: string): Promise<AnswerExtraction> {
  const prompt = `Extract key information from this interview answer.
Return ONLY valid JSON.
Question: "${question}"
Answer: "${answerTranscript}"
Language: "${language}"

Return an object matching the schema.`;

  try {
    const response = await getAi().models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            claimed_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            claimed_experience: { type: Type.STRING },
            confidence_signals: { type: Type.ARRAY, items: { type: Type.STRING } },
            weak_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            inconsistencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            follow_up_needed: { type: Type.BOOLEAN },
            answer_quality_0_10: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["key_points", "claimed_skills", "claimed_experience", "confidence_signals", "weak_points", "inconsistencies", "follow_up_needed", "answer_quality_0_10", "summary"]
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as AnswerExtraction;
    }
  } catch (err) {
      console.error('Error extracting answer key points:', err);
  }
  return { 
    key_points: [], claimed_skills: [], claimed_experience: "", 
    confidence_signals: [], weak_points: [], inconsistencies: [], 
    follow_up_needed: false, answer_quality_0_10: 5, summary: "Could not extract." 
  };
}

export async function generateFinalScorecard(context: InterviewContext, bodyLanguageSnapshots: any[]): Promise<ScorecardResponse> {
  const prompt = `You are evaluating an interview for the role of ${context.job.roleTitle}.
Job Requirements: ${context.job.skillsRequired.join(', ')}
Candidate Name: ${context.candidate.name}

Interview Transcript:
${context.conversationHistory.map(t => `Q: ${t.question}\nA: ${t.answerTranscript}`).join('\n\n')}

Analyze all responses and produce a comprehensive scorecard in JSON format. Generate a summary in English and Hindi. Evaluate the answer quality, experience match, communication, and summarize the provided body language.`;

  try {
    const response = await getAi().models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overall_score_0_100: { type: Type.NUMBER },
            hire_recommendation: { type: Type.STRING, enum: ["hire", "maybe", "no"] },
            recommendation_confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
            summary: { type: Type.STRING },
            summary_hindi: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
            red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            question_scores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer_summary: { type: Type.STRING },
                  score_0_10: { type: Type.NUMBER },
                  notes: { type: Type.STRING }
                },
                required: ["question", "answer_summary", "score_0_10", "notes"]
              }
            },
            score_breakdown: {
              type: Type.OBJECT,
              properties: {
                answer_quality: { type: Type.NUMBER },
                experience_match: { type: Type.NUMBER },
                communication: { type: Type.NUMBER },
                body_language: { type: Type.NUMBER },
                documents: { type: Type.NUMBER }
              },
              required: ["answer_quality", "experience_match", "communication", "body_language", "documents"]
            },
            body_language_summary: { type: Type.STRING },
            body_language_timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp_seconds: { type: Type.NUMBER },
                  confidence_score: { type: Type.NUMBER },
                  note: { type: Type.STRING }
                },
                required: ["timestamp_seconds", "confidence_score", "note"]
              }
            },
            suggested_onboarding_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            interview_duration_minutes: { type: Type.NUMBER }
          },
          required: ["overall_score_0_100", "hire_recommendation", "recommendation_confidence", "summary", "summary_hindi", "strengths", "concerns", "red_flags", "question_scores", "score_breakdown", "body_language_summary", "body_language_timeline", "suggested_onboarding_tips", "interview_duration_minutes"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScorecardResponse;
    }
  } catch (err) {
    console.error('Error generating scorecard:', err);
  }

  return {
    overall_score_0_100: 50,
    hire_recommendation: 'maybe',
    recommendation_confidence: 'low',
    summary: 'Error assessing response.',
    summary_hindi: 'त्रुटि (Error)',
    strengths: [],
    concerns: [],
    red_flags: [],
    question_scores: [],
    score_breakdown: {
      answer_quality: 10,
      experience_match: 10,
      communication: 10,
      body_language: 10,
      documents: 10
    },
    body_language_summary: 'Not available.',
    body_language_timeline: [],
    suggested_onboarding_tips: [],
    interview_duration_minutes: 0
  };
}

