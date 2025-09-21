
import React, { useMemo } from 'react';
import type { AnalysisHistoryItem, SortOption } from '../types.js';
import { FitVerdict } from '../types.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


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
    case FitVerdict.High: return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-300';
    case FitVerdict.Medium: return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300';
    case FitVerdict.Low: return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300';
    default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-600 dark:text-slate-200';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

interface AnalysisHistoryProps {
  theme: 'light' | 'dark';
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

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg">
        <p className="font-bold text-slate-800 dark:text-slate-100">{`Score Range: ${label}`}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{`Analyses: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ 
  theme,
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
  
  const chartData = useMemo(() => {
    const brackets = [
      { name: '0-10', count: 0 }, { name: '11-20', count: 0 },
      { name: '21-30', count: 0 }, { name: '31-40', count: 0 },
      { name: '41-50', count: 0 }, { name: '51-60', count: 0 },
      { name: '61-70', count: 0 }, { name: '71-80', count: 0 },
      { name: '81-90', count:0 }, { name: '91-100', count: 0 }
    ];

    history.forEach(item => {
      const score = item.result.relevanceScore;
      if (score > 0) {
        const index = Math.min(Math.floor((score - 1) / 10), 9);
        brackets[index].count++;
      } else if (score === 0) {
         brackets[0].count++;
      }
    });
    return brackets;
  }, [history]);

  const COLORS = [
    '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', 
    '#f59e0b', '#f59e0b', 
    '#22c55e', '#22c55e', '#22c55e'
  ];
  
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center">
          <HistoryIcon className="w-7 h-7 mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Analysis History</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
          aria-label="Clear all analysis history"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          Clear History
        </button>
      </div>

       <div className="mb-6">
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-2 text-center">Score Distribution</h3>
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={{ stroke: tickColor }} />
              <YAxis allowDecimals={false} tick={{ fill: tickColor, fontSize: 12 }} tickLine={{ stroke: tickColor }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(203, 213, 225, 0.4)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sort-history" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Sort by</label>
            <select
              id="sort-history"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-50"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="score-desc">Score (High to Low)</option>
              <option value="score-asc">Score (Low to High)</option>
              <option value="name-asc">Candidate Name (A-Z)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Filter by Verdict</label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onClearFilters}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterVerdicts.length === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'}`}
              >
                All
              </button>
              {verdictOptions.map(verdict => (
                <button
                  key={verdict}
                  onClick={() => onFilterChange(verdict)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterVerdicts.includes(verdict) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'}`}
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
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
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
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${isSelected ? 'bg-indigo-50 border-indigo-400 shadow-md scale-[1.02] dark:bg-indigo-500/10 dark:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100 dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.timestamp.toLocaleString()}</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 truncate" title={item.candidateName}>
                          {item.candidateName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate" title={item.resumeFileName}>
                         <span className="font-normal">File:</span> {item.resumeFileName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                        <div className="text-center">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
                          <p className={`text-xl font-bold ${getScoreColor(item.result.relevanceScore)}`}>
                            {item.result.relevanceScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Verdict</span>
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
