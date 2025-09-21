export enum FitVerdict {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export interface MissingElement {
  type: string;
  details: string;
}

export interface AnalysisResultData {
  relevanceScore: number;
  fitVerdict: FitVerdict;
  missingElements: MissingElement[];
  feedback: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: Date;
  resumeFileName: string;
  jdFileName: string;
  result: AnalysisResultData;
  resumeFileUrl?: string; // Link to the file in Firebase Storage
}

export type SortOption = 'date-desc' | 'score-desc' | 'score-asc' | 'name-asc';
