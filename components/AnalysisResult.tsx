
import React from 'react';
import type { AnalysisResultData } from '../types';
import { FitVerdict } from '../types';

interface AnalysisResultProps {
  data: AnalysisResultData;
}

const getVerdictClass = (verdict: FitVerdict) => {
  switch (verdict) {
    case FitVerdict.High:
      return 'bg-green-100 text-green-800';
    case FitVerdict.Medium:
      return 'bg-yellow-100 text-yellow-800';
    case FitVerdict.Low:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          className="transform-gpu -rotate-90 origin-center transition-all duration-1000 ease-out"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
    </div>
  );
};


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  return (
    <div className="w-full animate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Analysis Result</h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-slate-100 rounded-lg">
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-slate-600 mb-2">Relevance Score</span>
          <ScoreGauge score={data.relevanceScore} />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-slate-600 mb-2">Fit Verdict</span>
          <span className={`px-4 py-1.5 text-lg font-semibold rounded-full ${getVerdictClass(data.fitVerdict)}`}>
            {data.fitVerdict}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Missing Elements</h3>
        {data.missingElements.length > 0 ? (
          <ul className="space-y-2">
            {data.missingElements.map((item, index) => (
              <li key={index} className="flex items-start bg-red-50 p-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <span className="font-semibold text-red-800">{item.type}:</span>
                  <span className="ml-2 text-red-700">{item.details}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 bg-green-50 p-3 rounded-md">No significant gaps found. Great match!</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Personalized Feedback</h3>
        <p className="text-slate-600 bg-indigo-50 p-4 rounded-md border-l-4 border-indigo-400">
          {data.feedback}
        </p>
      </div>
    </div>
  );
};
