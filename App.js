import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.js';
import { ResumeUpload } from './components/ResumeInput.js';
import { JobDescriptionInput } from './components/JobDescriptionInput.js';
import { Button } from './components/Button.js';
import { AnalysisResult } from './components/AnalysisResult.js';
import { Spinner } from './components/Spinner.js';
import { AnalysisHistory } from './components/AnalysisHistory.js';
import { analyzeResume } from './services/geminiService.js';
import { getHistory, addHistoryItem, clearHistory } from './services/localStorageService.js';
import type { AnalysisResultData, AnalysisHistoryItem, SortOption, FitVerdict } from './types.js';
import { SparklesIcon } from './components/icons/SparklesIcon.js';
import { parseFileAsText } from './utils/fileParser.js';
import { AboutUs } from './components/AboutUs.js';

type View = 'analyzer' | 'about';

const App: React.FC = () => {
  // View state
  const [currentView, setCurrentView] = useState<View>('analyzer');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Language State
  const [language, setLanguage] = useState<string>('English');
  
  // File states
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [resumeTexts, setResumeTexts] = useState<string[]>([]);
  const [jdText, setJdText] = useState<string>('');
  
  // UI/Flow states
  const [isParsingResumes, setIsParsingResumes] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Array<{ resumeFileName: string; result: AnalysisResultData }> | null>(null);
  const [viewedAnalysisResult, setViewedAnalysisResult] = useState<AnalysisResultData | null>(null);

  // History states
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [filterVerdicts, setFilterVerdicts] = useState<FitVerdict[]>([]);

  useEffect(() => {
    // Apply theme class to the root element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Load history from local storage on initial render
  useEffect(() => {
    const storedHistory = getHistory();
    setHistory(storedHistory);
  }, []);
  
  const handleNavigate = (view: View) => {
    setCurrentView(view);
    // Reset analysis state when navigating away from the analyzer
    if (view !== 'analyzer') {
      setAnalysisResults(null);
      setViewedAnalysisResult(null);
      setSelectedHistoryId(null);
    }
  };

  const handleResumeSelect = async (files: File[]) => {
    setResumeFiles(files);
    setIsParsingResumes(true);
    setAnalysisResults(null);
    setViewedAnalysisResult(null);
    setError(null);
    try {
      const texts = await Promise.all(files.map(file => parseFileAsText(file)));
      setResumeTexts(texts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse one or more resume files.';
      setError(errorMessage);
      setResumeFiles([]);
      setResumeTexts([]);
    } finally {
      setIsParsingResumes(false);
    }
  };

  const handleJdChange = (jobDescriptionText: string) => {
    setJdText(jobDescriptionText);
    setAnalysisResults(null);
    setViewedAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (resumeTexts.length === 0 || !jdText || resumeFiles.length === 0) {
      setError('Please upload at least one resume and provide a job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);
    setViewedAnalysisResult(null);
    setSelectedHistoryId(null);

    try {
      // Step 1: Run AI analysis on the resume texts
      const analysisPromises = resumeFiles.map((resumeFile, index) => 
        analyzeResume(resumeTexts[index], jdText, language).then(result => ({
          resumeFileName: resumeFile.name,
          result
        }))
      );
      const results = await Promise.all(analysisPromises);
      results.sort((a, b) => b.result.relevanceScore - a.result.relevanceScore);
      setAnalysisResults(results);

      // Step 2: Save results to local storage history
      results.forEach(({ resumeFileName, result }) =>
        addHistoryItem({
          resumeFileName,
          jdFileName: "Custom Job Description",
          result,
          candidateName: result.candidateName,
        })
      );
      
      const updatedHistory = getHistory();
      setHistory(updatedHistory);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setSelectedHistoryId(id);
      setAnalysisResults(null);
      setViewedAnalysisResult(item.result);
      setResumeFiles([]);
      setResumeTexts([]);
      setJdText('');
    }
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all analysis history? This cannot be undone.")) {
      clearHistory();
      setHistory([]);
      setAnalysisResults(null);
      setViewedAnalysisResult(null);
      setSelectedHistoryId(null);
    }
  };

  const handleFilterChange = (verdict: FitVerdict) => {
    setFilterVerdicts(prev => 
      prev.includes(verdict) 
        ? prev.filter(v => v !== verdict) 
        : [...prev, verdict]
    );
  };

  const handleClearFilters = () => setFilterVerdicts([]);

  const sortedAndFilteredHistory = useMemo(() => {
    let result = [...history];
    if (filterVerdicts.length > 0) {
      result = result.filter(item => filterVerdicts.includes(item.result.fitVerdict));
    }
    result.sort((a, b) => {
        switch (sortOption) {
            case 'date-desc': return b.timestamp.getTime() - a.timestamp.getTime();
            case 'score-desc': return b.result.relevanceScore - a.result.relevanceScore;
            case 'score-asc': return a.result.relevanceScore - b.result.relevanceScore;
            case 'name-asc': return (a.candidateName || a.resumeFileName).localeCompare(b.candidateName || b.resumeFileName);
            default: return 0;
        }
    });
    return result;
  }, [history, sortOption, filterVerdicts]);

  const isAnalyzeDisabled = resumeFiles.length === 0 || !jdText || isParsingResumes || isLoading;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans transition-colors duration-200">
      <Header theme={theme} setTheme={setTheme} onNavigate={handleNavigate} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'analyzer' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <ResumeUpload onFileSelect={handleResumeSelect} selectedFiles={resumeFiles} isParsing={isParsingResumes} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <JobDescriptionInput onJdChange={handleJdChange} language={language} setLanguage={setLanguage} />
              </div>
              <div className="text-center">
                <Button onClick={handleAnalyze} disabled={isAnalyzeDisabled}>
                  {isLoading ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Analyzing... </> ) : ( <> <SparklesIcon className="w-5 h-5 mr-2" /> Analyze Now </> )}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
              {history.length > 0 && (
                <AnalysisHistory
                  theme={theme}
                  history={sortedAndFilteredHistory}
                  onSelectItem={handleSelectHistoryItem}
                  onClearHistory={handleClearHistory}
                  selectedId={selectedHistoryId}
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                  filterVerdicts={filterVerdicts}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              )}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[300px] flex items-center justify-center">
                {isLoading && (
                  <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">Analyzing documents...</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Analyzing {resumeFiles.length} resume(s) against the job description.</p>
                  </div>
                )}
                {error && (
                  <div className="text-center text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-500/30">
                    <h3 className="font-bold">An Error Occurred</h3>
                    <p>{error}</p>
                  </div>
                )}
                {!isLoading && !error && analysisResults && (
                  <div className="w-full animate-fade-in space-y-8 max-h-[80vh] overflow-y-auto p-2">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analysis Complete</h2>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">Results for {analysisResults.length} resume(s), sorted by relevance.</p>
                    </div>
                    {analysisResults.map(({ resumeFileName, result }, index) => (
                      <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100">
                          Candidate: <span className="font-medium text-indigo-600 dark:text-indigo-400">{result.candidateName || 'N/A'}</span>
                        </h3>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                          File: <span className="italic">{resumeFileName}</span>
                        </p>
                        <AnalysisResult data={result} />
                      </div>
                    ))}
                  </div>
                )}
                {!isLoading && !error && !analysisResults && viewedAnalysisResult && ( <AnalysisResult data={viewedAnalysisResult} /> )}
                {!isLoading && !error && !analysisResults && !viewedAnalysisResult && (
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <h2 className="text-xl font-semibold">Ready to Analyze</h2>
                    <p className="mt-2">Upload your resume(s) and enter a job description to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <AboutUs />
        )}
      </main>
    </div>
  );
};

export default App;
