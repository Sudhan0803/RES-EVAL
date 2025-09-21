import type { AnalysisHistoryItem, AnalysisResultData } from '../types';

const HISTORY_KEY = 'skillScanHistory';

// Type for new history items before they get an ID and timestamp
interface NewHistoryData {
  resumeFileName: string;
  jdFileName: string;
  result: AnalysisResultData;
  resumeFileUrl?: string;
}

export const getHistory = (): AnalysisHistoryItem[] => {
  try {
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    if (!rawHistory) {
      return [];
    }
    const history = JSON.parse(rawHistory) as any[];
    // Important: Convert timestamp strings back to Date objects
    return history.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const addHistoryItem = (item: NewHistoryData): void => {
  const history = getHistory();
  const newHistoryItem: AnalysisHistoryItem = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...item,
  };
  history.unshift(newHistoryItem); // Add to the beginning
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage", error);
  }
};
