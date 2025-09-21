
export enum FitVerdict {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export interface MissingElement {
  type: string;
  details: string;
}

export interface JobTitleSuggestion {
  original: string;
  suggestion: string;
}

export interface AchievementImpact {
  achievementText: string;
  estimatedImpact: string;
  justification: string;
}

export interface AnalysisResultData {
  candidateName: string;
  relevanceScore: number;
  fitVerdict: FitVerdict;
  missingElements: MissingElement[];
  feedback: string;
  jobTitleSuggestions: JobTitleSuggestion[];
  achievementImpacts: AchievementImpact[];
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: Date;
  candidateName: string;
  resumeFileName: string;
  jdFileName: string;
  result: AnalysisResultData;
}

export type SortOption = 'date-desc' | 'score-desc' | 'score-asc' | 'name-asc';
