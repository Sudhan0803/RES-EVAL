import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResultData } from "../types.ts";

// The API key is encoded in Base64 to obfuscate it from plain text view.
const ENCODED_API_KEY = "QUl6YVN5Q25CUmZhVF85cDdiWURkRW1USmFZYjhlTFJLXzgxarmr";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    candidateName: {
      type: Type.STRING,
      description: "The full name of the candidate as extracted from the resume. If no name is found, return 'N/A'.",
    },
    relevanceScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing how well the resume matches the job description.",
    },
    fitVerdict: {
      type: Type.STRING,
      enum: ["High", "Medium", "Low"],
      description: "A verdict on the candidate's suitability for the role.",
    },
    missingElements: {
      type: Type.ARRAY,
      description: "A list of key skills, technologies, or qualifications from the job description that are missing from the resume.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { 
            type: Type.STRING, 
            description: "The category of the missing element (e.g., 'Skill', 'Certification', 'Project')." 
          },
          details: { 
            type: Type.STRING,
            description: "Specific details about the missing element."
          },
        },
        required: ["type", "details"],
      },
    },
    feedback: {
      type: Type.STRING,
      description: "Concise, actionable feedback for the student on how to improve their resume for this specific role. This should be constructive and encouraging.",
    },
    jobTitleSuggestions: {
      type: Type.ARRAY,
      description: "A list of suggestions for non-standard job titles found in the resume. If no non-standard titles are found, this should be an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          original: {
            type: Type.STRING,
            description: "The original, non-standard job title found in the resume (e.g., 'Software Ninja')."
          },
          suggestion: {
            type: Type.STRING,
            description: "The suggested standard or more common job title (e.g., 'Software Engineer')."
          }
        },
        required: ["original", "suggestion"]
      }
    },
    achievementImpacts: {
      type: Type.ARRAY,
      description: "An analysis of key achievement bullet points from the resume, estimating their real-world impact and flagging exaggeration. If no achievements are found, this should be an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          achievementText: {
            type: Type.STRING,
            description: "The original achievement bullet point text from the resume."
          },
          estimatedImpact: {
            type: Type.STRING,
            description: "A realistic, quantified or qualified estimation of the achievement's impact (e.g., 'Likely a 5-10% efficiency improvement', 'Represents a standard project completion')."
          },
          justification: {
            type: Type.STRING,
            description: "A brief justification for the estimated impact, explaining why it's realistic or potentially inflated."
          }
        },
        required: ["achievementText", "estimatedImpact", "justification"]
      }
    }
  },
  required: ["candidateName", "relevanceScore", "fitVerdict", "missingElements", "feedback", "jobTitleSuggestions", "achievementImpacts"],
};

export const analyzeResume = async (resumeText: string, jobDescription: string, language: string): Promise<AnalysisResultData> => {
  const apiKey = atob(ENCODED_API_KEY);
  if (!apiKey) {
    throw new Error("API key is missing or could not be decoded.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert AI-powered resume evaluation engine named Skill Scan. Your task is to analyze a candidate's resume against a provided job description.
    
    Job Description:
    ---
    ${jobDescription}
    ---
    
    Candidate's Resume:
    ---
    ${resumeText}
    ---
    
    Strictly follow these instructions:
    1.  Identify and extract the full name of the candidate from the resume text. Return it as 'candidateName'. If a name cannot be clearly identified, return 'N/A'.
    2.  Calculate a 'Relevance Score' from 0 to 100 representing the match between the resume and the job description. A higher score means a better match.
    3.  Provide a 'Fit Verdict' which must be one of 'High', 'Medium', or 'Low'.
    4.  Identify 'Missing Elements' from the resume based on the job description. List key skills, technologies, certifications, or project types that are required or highly desired but not found in the resume. Be specific.
    5.  Generate concise, actionable 'Feedback' for the student on how to improve their resume for this specific role. The tone should be professional and helpful.
    6.  Analyze the job titles listed in the candidate's resume. Identify any titles that are unconventional, overly creative, or non-standard (e.g., 'Code Ninja', 'Growth Hacker', 'Marketing Guru'). For each one found, provide a more standard, professional equivalent (e.g., 'Software Engineer', 'Marketing Manager'). This list should be returned as 'jobTitleSuggestions'. If no such titles are found, return an empty array for this field.
    7.  Scrutinize achievement-oriented statements in the resume (e.g., "Increased sales by 50%", "Reduced costs by 30%"). For each major achievement, provide an 'Achievement Impact Estimation'. Estimate the real-world impact and provide a justification. If a claim seems unrealistic or inflated, state that in the justification. Return this as 'achievementImpacts'. If no specific achievements are found, return an empty array.
    8.  IMPORTANT: The entire response, especially the 'feedback', 'missingElements' details, and 'achievementImpacts' justifications, MUST be in ${language}.

    You MUST return your analysis in a JSON format that strictly adheres to the provided schema. Do not include any introductory text or markdown formatting outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Ensure arrays always exist
    if (!result.jobTitleSuggestions) {
      result.jobTitleSuggestions = [];
    }
    if (!result.achievementImpacts) {
      result.achievementImpacts = [];
    }
     if (!result.candidateName) {
      result.candidateName = 'N/A';
    }
    
    return result as AnalysisResultData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The embedded API key is not valid. Please contact the developer.");
    }
    throw new Error("Failed to get analysis from Gemini API.");
  }
};