export enum FitVerdict {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
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
  jdFileName: string;
  resumeFileName: string;
  result: AnalysisResultData;
  timestamp: string;
}
