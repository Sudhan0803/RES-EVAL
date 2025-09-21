import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <LogoIcon />
        <h1 className="text-2xl md:text-3xl font-bold text-primary ml-3">
          Skill Scan
        </h1>
      </div>
    </header>
  );
};