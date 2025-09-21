
import React, { useCallback, useState } from 'react';
import { UploadIcon, PdfIcon } from './icons';

interface ResumeUploaderProps {
  resumeFiles: File[];
  setResumeFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ resumeFiles, setResumeFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const pdfFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
      setResumeFiles(pdfFiles);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);


  const removeFile = (fileName: string) => {
    setResumeFiles(resumeFiles.filter(file => file.name !== fileName));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resumes</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-accent bg-light' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      >
        <div className="text-center">
          <UploadIcon />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-accent">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF files only (up to 1000)</p>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
          />
        </div>
      </div>
      {resumeFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-sm text-gray-600">Selected Files:</h4>
          <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
            {resumeFiles.map((file) => (
              <li key={file.name} className="flex items-center justify-between text-sm bg-gray-100 p-2 rounded-md">
                <div className="flex items-center truncate">
                  <PdfIcon />
                  <span className="ml-2 truncate" title={file.name}>{file.name}</span>
                </div>
                <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 font-bold ml-2">&times;</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
