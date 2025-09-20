import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JobDescriptionUpload } from './components/JobDescriptionInput';
import { ResumeUpload } from './components/ResumeInput';
import { AnalysisResult } from './components/AnalysisResult';
import { Button } from './components/Button';
import { Spinner } from './components/Spinner';
import { analyzeResume } from './services/geminiService';
import type { AnalysisResultData, AnalysisHistoryItem } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { AnalysisHistory } from './components/AnalysisHistory';

// These will be populated by the CDN scripts in index.html
declare const pdfjsLib: any;
declare const mammoth: any;

const App: React.FC = () => {
  // State for job description handling
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>('');
  const [isParsingJd, setIsParsingJd] = useState<boolean>(false);

  // State for resume handling
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);

  // State for API interaction and results
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for analysis history
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('resumeAnalysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('resumeAnalysisHistory');
    }
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('resumeAnalysisHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const parsePdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const parseDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleJdFileSelect = async (file: File) => {
    const fileType = file.type;
    if (!fileType.includes('pdf') && !fileType.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setError('Please select a valid PDF or DOCX file for the Job Description.');
      return;
    }

    setJdFile(file);
    setIsParsingJd(true);
    setError(null);
    setJdText('');
    setAnalysisResult(null);
    setSelectedHistoryId(null);

    try {
      let text = '';
      if (fileType.includes('pdf')) {
        text = await parsePdf(file);
      } else {
        text = await parseDocx(file);
      }
      setJdText(text);
    } catch (err) {
      console.error("JD Parsing Error:", err);
      setError('Failed to parse the Job Description file. It might be corrupted.');
      setJdFile(null);
    } finally {
      setIsParsingJd(false);
    }
  };

  const handleResumeFileSelect = async (file: File) => {
    if (!file || !file.type.includes('pdf')) {
      setError('Please select a valid PDF file for the resume.');
      return;
    };

    setResumeFile(file);
    setIsParsingResume(true);
    setError(null);
    setResumeText('');
    setAnalysisResult(null);
    setSelectedHistoryId(null);

    try {
      const text = await parsePdf(file);
      setResumeText(text);
    } catch (err) {
      console.error("Resume Parsing Error:", err);
      setError('Failed to parse the resume PDF. It might be corrupted or protected.');
      setResumeFile(null);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jdFile || !resumeFile || !jdText.trim() || !resumeText.trim()) {
      setError('Please upload both a job description and a resume.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedHistoryId(null);
    
    try {
      const result = await analyzeResume(resumeText, jdText);
      setAnalysisResult(result);

      // Add to history
      const newHistoryItem: AnalysisHistoryItem = {
        id: `analysis-${Date.now()}`,
        jdFileName: jdFile.name,
        resumeFileName: resumeFile.name,
        result: result,
        timestamp: new Date().toLocaleString(),
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the resume. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectHistoryItem = (id: string) => {
    const selectedItem = history.find(item => item.id === id);
    if (selectedItem) {
      setAnalysisResult(selectedItem.result);
      setSelectedHistoryId(id);
      setError(null);
      // Clear file inputs for clarity
      setJdFile(null);
      setResumeFile(null);
      setJdText('');
      setResumeText('');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setAnalysisResult(null);
    setSelectedHistoryId(null);
  };
  
  const canAnalyze = jdText.trim() && resumeText.trim() && !isParsingJd && !isParsingResume;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-600 mb-8 max-w-3xl mx-auto">
            This AI-powered tool evaluates a resume against a job description to generate a relevance score, identify skill gaps, and provide actionable feedback.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-8">
              <JobDescriptionUpload
                onFileSelect={handleJdFileSelect}
                selectedFile={jdFile}
                isParsing={isParsingJd}
              />
              <ResumeUpload 
                onFileSelect={handleResumeFileSelect} 
                selectedFile={resumeFile}
                isParsing={isParsingResume}
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col justify-center items-center lg:sticky lg:top-8">
              {isLoading ? (
                <div className="text-center">
                  <Spinner />
                  <p className="mt-4 text-lg font-medium text-slate-600">Analyzing...</p>
                  <p className="text-sm text-slate-500">This may take a few moments.</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                  <h3 className="font-bold">An Error Occurred</h3>
                  <p>{error}</p>
                </div>
              ) : analysisResult ? (
                <AnalysisResult data={analysisResult} />
              ) : (
                <div className="text-center text-slate-500">
                  <SparklesIcon className="w-16 h-16 mx-auto text-slate-400" />
                  <h2 className="mt-4 text-xl font-semibold">Ready for Analysis</h2>
                  <p className="mt-2 max-w-sm mx-auto">
                    Upload a job description and a resume, then click "Analyze" to see the AI-powered evaluation.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button onClick={handleAnalyze} disabled={!canAnalyze || isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </div>

          {history.length > 0 && (
            <div className="mt-16">
              <AnalysisHistory
                history={history}
                onSelectItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
                selectedId={selectedHistoryId}
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;