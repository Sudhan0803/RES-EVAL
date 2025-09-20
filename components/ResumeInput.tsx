import React, { useRef } from 'react';
import { DocumentIcon } from './icons/DocumentIcon';

// Inlined SVG Icons to avoid creating new files
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isParsing: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileSelect, selectedFile, isParsing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileSelect(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  return (
    <div>
      <label className="flex items-center text-lg font-semibold text-slate-700">
         <DocumentIcon className="w-6 h-6 mr-2 text-slate-500" />
        Upload Resume
      </label>
       <p className="text-sm text-slate-500 mt-1 mb-3">
        Select or drop a resume PDF to be evaluated.
      </p>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 bg-slate-50 transition-colors duration-200"
        aria-label="File upload area"
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
          <div className="flex text-sm text-slate-600">
            <span className="relative bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>{selectedFile ? 'Replace file' : 'Upload a file'}</span>
              <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500">PDF only</p>
        </div>
      </div>
      {isParsing && (
        <div className="mt-4 text-sm text-slate-600 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Parsing PDF... please wait.
        </div>
      )}
      {selectedFile && !isParsing && (
        <div className="mt-4 flex items-center justify-between bg-green-50 text-green-800 p-3 rounded-md border border-green-200">
          <div className="flex items-center min-w-0">
             <DocumentIcon className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={selectedFile.name}>{selectedFile.name}</span>
          </div>
          <span className="text-sm font-semibold ml-2 flex-shrink-0">Ready for analysis</span>
        </div>
      )}
    </div>
  );
};
