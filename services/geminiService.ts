
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResultData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
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
  },
  required: ["relevanceScore", "fitVerdict", "missingElements", "feedback"],
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResultData> => {
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
    1.  Calculate a 'Relevance Score' from 0 to 100 representing the match between the resume and the job description. A higher score means a better match.
    2.  Provide a 'Fit Verdict' which must be one of 'High', 'Medium', or 'Low'.
    3.  Identify 'Missing Elements' from the resume based on the job description. List key skills, technologies, certifications, or project types that are required or highly desired but not found in the resume. Be specific.
    4.  Generate concise, actionable 'Feedback' for the student on how to improve their resume for this specific role. The tone should be professional and helpful.

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
    
    return result as AnalysisResultData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};