import React from 'react';
import type { AnalysisHistoryItem, SortOption } from '../types';
import { FitVerdict } from '../types';

// Inlined SVG Icons
const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const getVerdictClass = (verdict: FitVerdict) => {
  switch (verdict) {
    case FitVerdict.High: return 'bg-green-100 text-green-800 border-green-200';
    case FitVerdict.Medium: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case FitVerdict.Low: return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelectItem: (id: string) => void;
  onClearHistory: () => void;
  selectedId: string | null;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filterVerdicts: FitVerdict[];
  onFilterChange: (verdict: FitVerdict) => void;
  onClearFilters: () => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ 
  history, 
  onSelectItem, 
  onClearHistory, 
  selectedId,
  sortOption,
  onSortChange,
  filterVerdicts,
  onFilterChange,
  onClearFilters,
}) => {
  const verdictOptions: FitVerdict[] = [FitVerdict.High, FitVerdict.Medium, FitVerdict.Low];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center">
          <HistoryIcon className="w-7 h-7 mr-3 text-slate-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-slate-800">Analysis History</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          aria-label="Clear all analysis history"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          Clear History
        </button>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sort-history" className="block text-sm font-medium text-slate-600 mb-1">Sort by</label>
            <select
              id="sort-history"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="score-desc">Score (High to Low)</option>
              <option value="score-asc">Score (Low to High)</option>
              <option value="name-asc">Resume Name (A-Z)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Filter by Verdict</label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onClearFilters}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterVerdicts.length === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'}`}
              >
                All
              </button>
              {verdictOptions.map(verdict => (
                <button
                  key={verdict}
                  onClick={() => onFilterChange(verdict)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterVerdicts.includes(verdict) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'}`}
                >
                  {verdict}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
        {history.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <p className="font-semibold">No Matching Analyses Found</p>
            <p className="text-sm mt-1">Try adjusting your sort or filter options, or clear the filters to see all results.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectItem(item.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${isSelected ? 'bg-indigo-50 border-indigo-400 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        {/* FIX: Convert Date object to string for rendering */}
                        <p className="text-xs text-slate-500 mb-1">{item.timestamp.toLocaleString()}</p>
                        <p className="font-semibold text-slate-700 truncate" title={item.resumeFileName}>
                          <span className="font-normal">Resume:</span> {item.resumeFileName}
                        </p>
                        <p className="text-sm text-slate-600 truncate" title={item.jdFileName}>
                         <span className="font-normal">JD:</span> {item.jdFileName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                        <div className="text-center">
                          <span className="text-xs text-slate-500">Score</span>
                          <p className={`text-xl font-bold ${getScoreColor(item.result.relevanceScore)}`}>
                            {item.result.relevanceScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-slate-500">Verdict</span>
                          <p className={`px-2.5 py-0.5 text-sm font-semibold rounded-full ${getVerdictClass(item.result.fitVerdict)}`}>
                            {item.result.fitVerdict}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};