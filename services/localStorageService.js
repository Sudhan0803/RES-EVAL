import type { AnalysisHistoryItem, AnalysisResultData } from '../types.js';

const HISTORY_KEY = 'skill-scan-history';

interface NewHistoryData {
  resumeFileName: string;
  jdFileName: string;
  candidateName: string;
  result: AnalysisResultData;
}

export const getHistory = (): AnalysisHistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson);
    // Convert date strings back into Date objects
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
};

export const addHistoryItem = (item: NewHistoryData): void => {
   const history = getHistory();
   const newHistoryItem: AnalysisHistoryItem = {
     ...item,
     id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
     timestamp: new Date(),
   };
   const updatedHistory = [newHistoryItem, ...history];
   localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};