
import React from 'react';
import type { JobDetails } from '../types';

interface JobInputFormProps {
  jobDetails: JobDetails;
  setJobDetails: React.Dispatch<React.SetStateAction<JobDetails>>;
}

export const JobInputForm: React.FC<JobInputFormProps> = ({ jobDetails, setJobDetails }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value, 10) || 0 : value,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={jobDetails.description}
          onChange={handleChange}
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Paste the full job description here..."
        />
      </div>
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={jobDetails.skills}
          onChange={handleChange}
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="e.g., react, typescript, node.js"
        />
        <p className="text-xs text-gray-500 mt-1">Separate skills with a comma.</p>
      </div>
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Years of Experience
        </label>
        <input
          type="number"
          id="experience"
          name="experience"
          value={jobDetails.experience}
          onChange={handleChange}
          min="0"
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="e.g., 3"
        />
      </div>
    </div>
  );
};
