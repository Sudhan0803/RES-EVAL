
export interface JobDetails {
  description: string;
  skills: string;
  experience: number;
}

export interface AnalysisResult {
  fileName: string;
  score: number;
  matchedSkills: string[];
  foundExperience: number;
  error?: string;
}
