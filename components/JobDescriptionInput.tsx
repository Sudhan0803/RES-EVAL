import React, { useState, useEffect } from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon.tsx';

// --- Inlined SVG Icons for enhanced UI ---
const ExperienceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.92a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 01.92-1.75l5.25-3.11a.75.75 0 01.82 0l5.25 3.11a2.25 2.25 0 01.92 1.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25v-3.37a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25v3.37" />
  </svg>
);

const EducationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" />
  </svg>
);

const SkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const LanguagesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.117 2.67.164M12 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const CertificationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.436 18.257A8.956 8.956 0 0112 21a8.956 8.956 0 01-3.436-2.743m6.872 0l-3.436-4.295-3.436 4.295m6.872 0l-3.436-4.295-3.436 4.295M12 3a8.956 8.956 0 013.436 2.743m-6.872 0l3.436 4.295 3.436-4.295m-6.872 0l3.436 4.295 3.436-4.295" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);


const popularSkills = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'HTML/CSS', 'Go', 'Java', 'C#', '.NET', 'Next.js', 'GraphQL', 'Vue.js', 'Angular', 'CI/CD', 'Git'];
const popularLanguages = ['English', 'Spanish', 'French', 'German', 'Mandarin Chinese', 'Japanese', 'Portuguese', 'Hindi'];
const educationLevels = ["High School / GED", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)"];
const analysisLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin Chinese', 'Portuguese'];

interface ExperienceItem {
  id: number;
  years: string;
  field: string;
}

interface JobDescriptionInputProps {
  onJdChange: (text: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onJdChange, language, setLanguage }) => {
    // Experience State
    const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
    const [currentYears, setCurrentYears] = useState('');
    const [currentField, setCurrentField] = useState('');

    // Education State
    const [educationLevel, setEducationLevel] = useState('');
    const [educationField, setEducationField] = useState('');

    // Skills State
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [customSkill, setCustomSkill] = useState<string>('');

    // Certifications State
    const [certifications, setCertifications] = useState<string[]>([]);
    const [customCertification, setCustomCertification] = useState('');

    // Languages State
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [customLanguage, setCustomLanguage] = useState<string>('');

  useEffect(() => {
    const generateJdText = () => {
      let parts = [];
      
      if (experienceItems.length > 0) {
        parts.push("Experience:\n" + experienceItems.map(item => `- ${item.years} years in ${item.field}.`).join('\n'));
      }
      
      if (educationLevel && educationField) {
        parts.push(`Education:\n- ${educationLevel} in ${educationField}.`);
      } else if (educationLevel) {
        parts.push(`Education:\n- ${educationLevel} required.`);
      }

      if (selectedSkills.length > 0) {
        parts.push("Required Skills:\n" + selectedSkills.map(skill => `- ${skill}`).join('\n'));
      }

      if (certifications.length > 0) {
        parts.push("Certifications:\n" + certifications.map(cert => `- ${cert}`).join('\n'));
      }
      
      if (selectedLanguages.length > 0) {
        parts.push("Required Languages:\n" + selectedLanguages.map(lang => `- ${lang}`).join('\n'));
      }
      
      if (parts.length > 0) {
        onJdChange("Job Requirements:\n\n" + parts.join('\n\n'));
      } else {
        onJdChange(''); // Pass empty string if no criteria are set
      }
    };
    
    generateJdText();
  }, [experienceItems, educationLevel, educationField, selectedSkills, certifications, selectedLanguages, onJdChange]);

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentYears && currentField) {
      setExperienceItems(prev => [...prev, { id: Date.now(), years: currentYears, field: currentField }]);
      setCurrentYears('');
      setCurrentField('');
    }
  };

  const handleRemoveExperience = (id: number) => {
    setExperienceItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSkill = customSkill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills(prev => [...prev, trimmedSkill]);
      setCustomSkill('');
    }
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCert = customCertification.trim();
    if (trimmedCert && !certifications.includes(trimmedCert)) {
      setCertifications(prev => [...prev, trimmedCert]);
      setCustomCertification('');
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    setCertifications(prev => prev.filter(cert => cert !== certToRemove));
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]);
  };
  
  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLanguage = customLanguage.trim();
    if (trimmedLanguage && !selectedLanguages.includes(trimmedLanguage)) {
      setSelectedLanguages(prev => [...prev, trimmedLanguage]);
      setCustomLanguage('');
    }
  };

  const allSkillsToRender = [...new Set([...popularSkills, ...selectedSkills.filter(s => !popularSkills.includes(s))])];
  const allLanguagesToRender = [...new Set([...popularLanguages, ...selectedLanguages.filter(l => !popularLanguages.includes(l))])];


  return (
    <div className="space-y-8">
      <div className="flex items-center text-lg font-semibold text-slate-700 dark:text-slate-200">
        <BriefcaseIcon className="w-6 h-6 mr-2 text-slate-500 dark:text-slate-400" />
        <h2>Job Description Builder</h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 -mt-6">
        Build a job description by selecting the required criteria below.
      </p>

      {/* Language Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LanguagesIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">Analysis Language</h3>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div>
            <label htmlFor="analysis-language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feedback Language</label>
            <select 
              id="analysis-language" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50"
            >
              {analysisLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">The AI's feedback will be provided in this language.</p>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ExperienceIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">Experience</h3>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
          <form onSubmit={handleAddExperience} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="years-experience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Years</label>
                <input type="number" id="years-experience" value={currentYears} onChange={(e) => setCurrentYears(e.target.value)} min="0" className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50" placeholder="e.g., 5" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="field-experience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Field</label>
                <div className="flex gap-2">
                    <input type="text" id="field-experience" value={currentField} onChange={(e) => setCurrentField(e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50" placeholder="e.g., Software Development" />
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-500" disabled={!currentYears || !currentField}>Add</button>
                </div>
              </div>
          </form>
          {experienceItems.length > 0 && <hr className="border-slate-200 dark:border-slate-700" />}
          <div className="space-y-2">
            {experienceItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-600">
                  <p className="text-sm text-slate-800 dark:text-slate-200"><span className="font-semibold">{item.years} years</span> in {item.field}</p>
                  <button onClick={() => handleRemoveExperience(item.id)} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"><XCircleIcon className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <EducationIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">Education</h3>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="education-level" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
              <select id="education-level" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50">
                <option value="">Select level...</option>
                {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="education-field" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Field of Study</label>
              <input type="text" id="education-field" value={educationField} onChange={(e) => setEducationField(e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50" placeholder="e.g., Computer Science" />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SkillsIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">Skills</h3>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
              {allSkillsToRender.sort().map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button key={skill} onClick={() => handleSkillToggle(skill)} className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 ${ isSelected ? 'bg-indigo-600 text-white shadow-md focus:ring-indigo-500' : 'bg-white text-slate-700 border border-slate-300 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-sm focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600' }`}>
                      {isSelected && <CheckIcon className="w-4 h-4 mr-1.5" />}
                      {skill}
                  </button>
                );
              })}
          </div>
          <form onSubmit={handleAddCustomSkill} className="mt-4 flex items-center gap-2">
            <input type="text" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50" placeholder="Add a custom skill..." />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add</button>
          </form>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CertificationIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">Certifications</h3>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
           <form onSubmit={handleAddCertification} className="flex items-center gap-2">
            <input type="text" value={customCertification} onChange={(e) => setCustomCertification(e.target.value)} className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50" placeholder="e.g., AWS Certified Cloud Practitioner" />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add</button>
          </form>
          {certifications.length > 0 && <hr className="my-4 border-slate-200 dark:border-slate-700" />}
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-600">
                  <p className="text-sm text-slate-800 dark:text-slate-200">{cert}</p>
                  <button onClick={() => handleRemoveCertification(cert)} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"><XCircleIcon className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LanguagesIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">Languages</h3>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
              {allLanguagesToRender.sort().map(lang => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button key={lang} onClick={() => handleLanguageToggle(lang)} className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 ${ isSelected ? 'bg-teal-600 text-white shadow-md focus:ring-teal-500' : 'bg-white text-slate-700 border border-slate-300 hover:bg-teal-50 hover:border-teal-400 hover:shadow-sm focus:ring-teal-500 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600' }`}>
                      {isSelected && <CheckIcon className="w-4 h-4 mr-1.5" />}
                      {lang}
                  </button>
                );
              })}
          </div>
          <form onSubmit={handleAddCustomLanguage} className="mt-4 flex items-center gap-2">
            <input type="text" value={customLanguage} onChange={(e) => setCustomLanguage(e.target.value)} className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50" placeholder="Add a custom language..." />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};