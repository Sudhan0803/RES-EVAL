import React, { useRef, useState } from 'react';
import { DocumentIcon } from './icons/DocumentIcon.js';

// Inlined SVG Icons to avoid creating new files
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

interface ResumeUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles: File[];
  isParsing: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileSelect, selectedFiles, isParsing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileCount, setFileCount] = useState<string>('1');
  const [error, setError] = useState<string | null>(null);

  const handleFileCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
     if (value === '' || parseInt(value, 10) > 0) {
      setFileCount(value);
      setError(null);
      // Clear existing selection if count changes, to enforce re-upload
      if (selectedFiles.length > 0) {
        onFileSelect([]);
      }
    }
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const expectedCount = parseInt(fileCount, 10);

    if (isNaN(expectedCount) || expectedCount <= 0) {
      setError('Please enter a valid number of files (1 or more).');
      return;
    }

    if (fileArray.length !== expectedCount) {
      setError(`Please select exactly ${expectedCount} file(s). You selected ${fileArray.length}.`);
      if (selectedFiles.length > 0) {
        onFileSelect([]);
      }
      return;
    }

    setError(null);
    onFileSelect(fileArray);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    processFiles(event.dataTransfer.files);
    event.dataTransfer.clearData();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  return (
    <div>
      <label className="flex items-center text-lg font-semibold text-slate-700 dark:text-slate-200">
         <DocumentIcon className="w-6 h-6 mr-2 text-slate-500 dark:text-slate-400" />
        Upload Resume(s)
      </label>
       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
        Specify how many resumes you want to analyze, then upload the files.
      </p>

      <div className="mb-4">
        <label htmlFor="num-resumes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Number of Resumes
        </label>
        <input
          type="number"
          id="num-resumes"
          name="num-resumes"
          value={fileCount}
          onChange={handleFileCountChange}
          min="1"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-50"
          aria-describedby="num-resumes-description"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400" id="num-resumes-description">
          Enter the exact number of files you will upload.
        </p>
      </div>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-200"
        aria-label="File upload area for Resumes"
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
          <div className="flex text-sm text-slate-600 dark:text-slate-300">
            <span className="relative bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>{selectedFiles.length > 0 ? 'Replace files' : `Upload ${fileCount || '...'} file(s)`}</span>
              <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} multiple />
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">PDF only</p>
        </div>
      </div>
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/30">
          {error}
        </div>
      )}
      {isParsing && (
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Parsing PDFs... please wait.
        </div>
      )}
      {selectedFiles.length > 0 && !isParsing && (
        <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedFiles.length} file(s) ready for analysis:</p>
            <ul className="max-h-32 overflow-y-auto space-y-1 bg-green-50 text-green-800 p-3 rounded-md border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500/30">
                {selectedFiles.map(file => (
                    <li key={file.name} className="flex items-center text-sm font-medium">
                        <DocumentIcon className="w-4 h-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="truncate" title={file.name}>{file.name}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};