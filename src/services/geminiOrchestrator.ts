import { GoogleGenAI } from '@google/genai';
import { BASE_SALARIES_2025 } from '../data/indiaSalaryData';

let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiInstance;
}

import { businessCategories } from '../data/constants';



export async function generateTeamBlueprint(businessData: any) {
  // Use category names instead of IDs for the prompt
  const catNames = businessData.categoryIds.map((id: string) => {
    return businessCategories.find(c => c.id === id)?.name || id;
  });

  const salaryContext = JSON.stringify(BASE_SALARIES_2025);

  const prompt = `
You are the HireGuru AI Team Architect for small to medium Indian businesses.
The user is opening or managing a business and needs a Team Blueprint.

Business Details:
Categories: ${catNames.join(', ')}
Description: ${businessData.description || 'Not provided'}
Location: ${businessData.location?.area || ''}, ${businessData.location?.city || ''}, ${businessData.location?.state || ''}
Space Size: ${businessData.calculatedArea} sq ft
Budget Range ID: ${businessData.budgetRangeId} (1=10-20k, 2=20-40k, 3=40-60k, 4=60-80k, 5=80-1L, 6=1-1.5L, 7=1.5-2L, 8=2-3L)
Urgency: ${businessData.urgencyText || 'Not specified'}

Base Salary Context for India (2025 averages):
${salaryContext}

Task:
Calculate EXACTLY how many non-managerial staff they need based on their square footage (calculatedArea) and the nature of the business.
Then, allocate roles ensuring the TOTAL estimated monthly salary fits within their Budget Range.
Identify priorities based on Urgency.

Return ONLY this JSON:
{
  "totalRecommendedStaff": number,
  "estimatedMonthlyBudgetStr": "string (e.g. ₹35,000 - ₹45,000)",
  "budgetStatus": "Within Budget" | "Slightly Over Budget" | "Needs Review",
  "roles": [
    {
      "id": 1,
      "title": "Role Title (e.g. Senior Hair Stylist)",
      "count": 2,
      "priority": "HIRE FIRST 🔴" | "HIRE SOON 🟡" | "HIRE LATER 🟢",
      "salary": "₹12k - ₹18k",
      "reqs": "Short description of what to look for (skills, exp)"
    }
  ]
}
`;

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
  } catch (err) {
    console.error("Gemini blueprint error:", err);
  }
  
  return null;
}

export async function getNextQuestion(ctx: any) {
  const prompt = `
You are HireGuru AI — a warm, professional Indian interviewer.
Conduct a natural voice interview in ${ctx.language}.

Job: ${ctx.job.roleTitle} at ${ctx.job.businessType}
Location: ${ctx.job.city}
Skills needed: ${ctx.job.skillsRequired?.join(', ')}
Experience: ${ctx.job.experienceRequired}

Candidate: ${ctx.candidate.name}
Their experience: ${ctx.candidate.yearsExperience || 0} years
Their documents: ${ctx.candidate.docSummary || 'None uploaded'}

Conversation so far (${ctx.turnNumber} turns):
${ctx.conversationHistory.map((t: any) =>
  `Q: ${t.question}\nA: ${t.answerTranscript}\nScore: ${t.answerScore || 0}/10\nKey Points: ${t.answerKeyPoints?.join(', ')}`
).join('\n---\n')}

Topics already covered: ${ctx.coveredTopics.join(', ')}
Red flags detected: ${ctx.redFlagsDetected.join(', ') || 'None'}

Rules:
- Ask only ONE question
- Make it sound natural and warm (not robotic)
- If language is hi-IN or hinglish, write in Hindi/Hinglish
- Do NOT repeat topics already covered
- After 8-10 turns OR 12 minutes, set stop_interview: true
- First question must always be type "intro"
- Use counter questions if previous answer was vague
- Use scenario questions for roles involving customer interaction
- End with salary/availability before closing

Return ONLY this JSON, no other text:
{
  "question": "exact question text",
  "spoken_question": "natural version for text-to-speech",
  "question_type": "intro|experience|skills|scenario|counter|pressure|salary|closing",
  "time_limit_seconds": null,
  "show_timer": false,
  "why_this_question": "brief reasoning",
  "stop_interview": false,
  "transition_to_roleplay": false
}
`;

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
  } catch (err) {
    console.error("Gemini context error:", err);
  }
  
  // Fallback
  return {
    question: "Thank you for sharing. Could you tell me more about your past experience?",
    spoken_question: "Thank you for sharing. Could you tell me more about your past experience?",
    question_type: "experience",
    time_limit_seconds: null,
    show_timer: false,
    why_this_question: "Fallback generic question",
    stop_interview: false,
    transition_to_roleplay: false
  };
}

export async function analyzeAnswer(question: string, transcript: string, currentCtx: any) {
  const prompt = `
Analyze the candidate's answer to the question.
Language Context: ${currentCtx.language}
Question: ${question}
Candidate's Answer: ${transcript}

Return ONLY this JSON:
{
  "key_points": ["point 1", "point 2"],
  "answer_quality_0_10": number,
  "claimed_skills": ["skill 1", "skill 2"],
  "red_flags": ["any concerns or false if none"],
  "sentiment": "positive|neutral|negative"
}
`;

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
  } catch (err) {
    console.error("Gemini analysis error:", err);
  }
  
  return {
      key_points: ["Candidate provided an answer"],
      answer_quality_0_10: 5,
      claimed_skills: [],
      red_flags: [],
      sentiment: "neutral"
  };
}

export async function scoreInterview(ctx: any) {
  const prompt = `
You are an expert HR analyst for Indian small businesses.
Analyze this complete interview and generate a scorecard.

Job: ${ctx.job.roleTitle} at a ${ctx.job.businessType}
in ${ctx.job.city}, India.
Required skills: ${ctx.job.skillsRequired?.join(', ')}
Salary range: ${ctx.job.salaryRange}

Full interview transcript:
${ctx.conversationHistory.map((t: any, i: number) =>
  `Q${i+1} [${t.questionType}]: ${t.question}
   Answer: ${t.answerTranscript}
   Key points: ${t.answerKeyPoints?.join(', ')}`
).join('\n\n')}

Body language data (assistive only):
${JSON.stringify(ctx.bodyLanguageSnapshots || [])}

Candidate self-assessment: ${JSON.stringify(ctx.selfAssessment || {})}
Documents summary: ${ctx.candidate.docSummary}

Return ONLY this JSON:
{
  "overall_score_0_100": number,
  "hire_recommendation": "hire|maybe|no",
  "summary_english": "2-3 sentences",
  "summary_hindi": "same in Hindi",
  "strengths": ["string"],
  "concerns": ["string"],
  "red_flags": ["string"],
  "score_breakdown": {
    "answer_quality_0_30": number,
    "experience_match_0_20": number,
    "communication_0_20": number,
    "body_language_0_15": number,
    "documents_0_15": number
  },
  "question_scores": [
    {
      "question": "string",
      "answer_summary": "string",
      "score_0_10": number,
      "notes": "string"
    }
  ],
  "confidence_timeline": [
    {"turn": number, "score": number, "note": "string"}
  ],
  "suggested_first_month_plan": ["string"],
  "salary_recommendation": "string"
}
`;

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });
    if (response.text) {
        return JSON.parse(response.text);
    }
  } catch (e) {
      console.error(e);
  }
  
  return {
    overall_score_0_100: 50,
    hire_recommendation: "maybe",
    summary_english: "Could not generate full report due to an error.",
    summary_hindi: "त्रुटि के कारण पूरी रिपोर्ट जनरेट नहीं हो सकी।",
    strengths: [],
    concerns: [],
    red_flags: [],
    score_breakdown: { answer_quality_0_30: 15, experience_match_0_20: 10, communication_0_20: 10, body_language_0_15: 10, documents_0_15: 5 },
    question_scores: [],
    confidence_timeline: [],
    suggested_first_month_plan: [],
    salary_recommendation: "Review manually."
  };
}
