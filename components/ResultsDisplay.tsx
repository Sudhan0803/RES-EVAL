
import React from 'react';
import type { AnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { EmptyStateIcon, TrophyIcon, SkillsIcon, ExperienceIcon } from './icons';

interface ResultsDisplayProps {
  results: AnalysisResult[];
  isLoading: boolean;
}

const ResultCard: React.FC<{ result: AnalysisResult; rank: number }> = ({ result, rank }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getBorderColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-400';
    if (rank === 2) return 'border-gray-300';
    if (rank === 3) return 'border-yellow-600';
    return 'border-gray-200';
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${getBorderColor(rank)} transition hover:shadow-lg hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            {rank === 1 && <TrophyIcon />}
            <p className={`text-lg font-bold ${rank === 1 ? 'text-yellow-500' : 'text-primary'} ml-2`}>Rank #{rank}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-gray-800">{result.score}%</p>
          <p className="text-xs text-gray-500">Match Score</p>
        </div>
      </div>

      <h3 className="text-md font-semibold text-gray-700 truncate mb-3" title={result.fileName}>{result.fileName}</h3>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className={`${getScoreColor(result.score)} h-2.5 rounded-full`} style={{ width: `${result.score}%` }}></div>
      </div>
      
      {result.error ? (
        <p className="text-red-500 text-sm">{result.error}</p>
      ) : (
        <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <SkillsIcon/>
              <div className="ml-2">
                <p className="font-semibold text-gray-600">Matched Skills:</p>
                {result.matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.matchedSkills.map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                ) : <p className="text-gray-500 italic text-xs">No matching skills found.</p>}
              </div>
            </div>
             <div className="flex items-start">
              <ExperienceIcon/>
              <div className="ml-2">
                 <p className="font-semibold text-gray-600">Experience Detected:</p>
                 <p className="text-gray-700">{result.foundExperience > 0 ? `${result.foundExperience} years` : 'Not specified'}</p>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-primary font-semibold">Analyzing resumes, please wait...</p>
        <p className="mt-1 text-sm text-gray-500">This might take a moment for a large number of files.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center min-h-[400px]">
        <EmptyStateIcon />
        <h3 className="mt-4 text-xl font-semibold text-gray-700">Ready for Analysis</h3>
        <p className="mt-1 text-gray-500">
          Enter job details, upload resumes, and click 'Analyze' to see the ranked results here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-primary mb-6">Analysis Results</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <ResultCard key={result.fileName} result={result} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};
