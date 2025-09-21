import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold leading-tight text-slate-900">
              Skill Scan
            </h1>
          </div>
        </div>
         <p className="text-center text-slate-500 mt-2">
          Instantly scan your resume against any job description.
        </p>
      </div>
    </header>
  );
};

export default Header;
