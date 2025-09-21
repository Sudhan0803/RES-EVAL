import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResultData } from '../types.ts';
import { FitVerdict } from '../types.ts';

interface AnalysisResultProps {
  data: AnalysisResultData;
}

const getVerdictClass = (verdict: FitVerdict) => {
  switch (verdict) {
    case FitVerdict.High:
      return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
    case FitVerdict.Medium:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
    case FitVerdict.Low:
      return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-200 dark:text-slate-700"
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

// Inlined Icons
const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.406-.206-2.744-.576-4.012-1.055a4.501 4.501 0 013.422-5.998l3.08-1.232c.527-.21 1.1-.21 1.626 0l3.08 1.232a4.5 4.5 0 013.422 5.998 12.054 12.054 0 01-4.012 1.055z" />
  </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.25h-3l-.75.75 1.5 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.5 0a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) return;

    setIsDownloading(true);
    try {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Improve resolution
        useCORS: true,
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', // slate-800 or white
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling'], // Important for px units
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / pdfWidth;
      const scaledHeight = canvasHeight / ratio;
      
      let heightLeft = scaledHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
      heightLeft -= pdfHeight;

      // Add more pages if content is taller than one page
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`SkillScan_Analysis_${data.candidateName.replace(/\s/g, '_') || 'Report'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert('Sorry, there was an error creating the PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Analysis for {data.candidateName || "Candidate"}
        </h2>
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="mt-3 sm:mt-0 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-500 transition-all w-full sm:w-auto"
          aria-label="Download analysis as PDF"
        >
          {isDownloading ? (
             <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
            </>
          ) : (
            <><DownloadIcon className="w-4 h-4 mr-2" /> Download PDF</>
          )}
        </button>
      </div>
      
      <div ref={reportRef} className="p-6 bg-white dark:bg-slate-800" id="analysis-report">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Relevance Score</span>
              <ScoreGauge score={data.relevanceScore} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Fit Verdict</span>
              <span className={`px-4 py-1.5 text-lg font-semibold rounded-full ${getVerdictClass(data.fitVerdict)}`}>
                {data.fitVerdict}
              </span>
            </div>
          </div>
          
          {data.jobTitleSuggestions && data.jobTitleSuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                <LightbulbIcon className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                Job Title Suggestions
              </h3>
              <ul className="space-y-2">
                {data.jobTitleSuggestions.map((item, index) => (
                  <li key={index} className="flex items-center bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-md border border-yellow-200 dark:border-yellow-500/30">
                    <span className="font-medium text-yellow-800 dark:text-yellow-400">{item.original}</span>
                    <ArrowRightIcon className="w-5 h-5 mx-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-yellow-900 dark:text-yellow-200">{item.suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.achievementImpacts && data.achievementImpacts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                <TargetIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                Achievement Impact Analysis
              </h3>
              <div className="space-y-3">
                {data.achievementImpacts.map((item, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <blockquote className="border-l-4 border-slate-400 dark:border-slate-500 pl-4 italic text-slate-600 dark:text-slate-300">
                      "{item.achievementText}"
                    </blockquote>
                    <div className="mt-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        Estimated Impact: <span className="font-normal text-sky-700 dark:text-sky-300">{item.estimatedImpact}</span>
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold">Justification:</span> {item.justification}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Missing Elements</h3>
            {data.missingElements.length > 0 ? (
              <ul className="space-y-2">
                {data.missingElements.map((item, index) => (
                  <li key={index} className="flex items-start bg-red-50 dark:bg-red-500/10 p-3 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-red-800 dark:text-red-300">{item.type}:</span>
                      <span className="ml-2 text-red-700 dark:text-red-300">{item.details}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 bg-green-50 p-3 rounded-md dark:bg-green-500/10 dark:text-green-300">No significant gaps found. Great match!</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Personalized Feedback</h3>
            <p className="text-slate-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-md border-l-4 border-indigo-400 dark:border-indigo-500">
              {data.feedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};