
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { JobInputForm } from './components/JobInputForm';
import { ResumeUploader } from './components/ResumeUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { parseResume } from './services/resumeParser';
import type { AnalysisResult, JobDetails } from './types';
import { AnalyzeIcon } from './components/icons';

const App: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    description: '',
    skills: '',
    experience: 0,
  });
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const scoreResume = (resumeText: string, job: JobDetails): AnalysisResult => {
    const text = resumeText.toLowerCase();
    const requiredSkills = job.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    
    let matchedSkills: string[] = [];
    let skillScore = 0;
    const skillWeight = 70; // Skills make up 70% of the score

    if (requiredSkills.length > 0) {
        requiredSkills.forEach(skill => {
            if (text.includes(skill)) {
                matchedSkills.push(skill);
            }
        });
        skillScore = (matchedSkills.length / requiredSkills.length) * skillWeight;
    } else {
        skillScore = skillWeight; // If no skills specified, give full skill score
    }

    let experienceScore = 0;
    const experienceWeight = 30; // Experience makes up 30% of the score
    const experienceRegex = /(\d{1,2})\+?\s*(years|yrs|year)/g;
    let match;
    let maxExperienceFound = 0;
    while ((match = experienceRegex.exec(text)) !== null) {
        const years = parseInt(match[1], 10);
        if (years > maxExperienceFound) {
            maxExperienceFound = years;
        }
    }

    if (job.experience > 0) {
      if (maxExperienceFound >= job.experience) {
        experienceScore = experienceWeight;
      } else if (maxExperienceFound > 0) {
        // Prorated score if some experience is found but less than required
        experienceScore = (maxExperienceFound / job.experience) * experienceWeight * 0.5;
      }
    } else {
        experienceScore = experienceWeight; // If no experience required, give full score
    }
    
    const totalScore = Math.min(100, Math.round(skillScore + experienceScore));

    return {
        fileName: '', // Will be set in the handler
        score: totalScore,
        matchedSkills,
        foundExperience: maxExperienceFound,
    };
  };

  const handleAnalyze = useCallback(async () => {
    if (resumeFiles.length === 0) {
      setError('Please upload at least one resume.');
      return;
    }
    if (!jobDetails.skills && jobDetails.experience === 0) {
        setError('Please specify required skills or minimum experience.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResults([]);

    try {
      const results: AnalysisResult[] = [];
      for (const file of resumeFiles) {
        try {
          const resumeText = await parseResume(file);
          const result = scoreResume(resumeText, jobDetails);
          result.fileName = file.name;
          results.push(result);
        } catch (parseError) {
          console.error(`Failed to parse ${file.name}:`, parseError);
          results.push({
            fileName: file.name,
            score: 0,
            matchedSkills: [],
            foundExperience: 0,
            error: 'Failed to parse PDF.',
          });
        }
      }
      
      results.sort((a, b) => b.score - a.score);
      setAnalysisResults(results);

    } catch (e) {
      setError('An unexpected error occurred during analysis.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [resumeFiles, jobDetails]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit">
            <h2 className="text-2xl font-bold text-primary mb-6">Evaluation Criteria</h2>
            <div className="space-y-6">
              <JobInputForm jobDetails={jobDetails} setJobDetails={setJobDetails} />
              <ResumeUploader resumeFiles={resumeFiles} setResumeFiles={setResumeFiles} />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                onClick={handleAnalyze}
                disabled={isLoading || resumeFiles.length === 0}
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? <Spinner /> : <AnalyzeIcon />}
                <span className="ml-2">{isLoading ? 'Analyzing...' : 'Analyze Resumes'}</span>
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <ResultsDisplay results={analysisResults} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
