import React from 'react';

// Icons for the component
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 00-10.428 0M19.368 15.368a9.38 9.38 0 00-14.736 0M12 3v9.75m0 0a2.25 2.25 0 00-2.25 2.25H12a2.25 2.25 0 00-2.25-2.25V3m2.25 9.75A2.25 2.25 0 0112 15h0a2.25 2.25 0 01-2.25-2.25H12V3m0 18a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

const RocketLaunchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.954 14.954 0 00-5.84-2.56m0 0a14.954 14.954 0 01-5.84-2.56m5.84 2.56v-4.82m0 4.82a6 6 0 005.84-7.38m-5.84 7.38l-3.3-3.3m3.3 3.3l3.3-3.3" />
    </svg>
);


export const AboutUs: React.FC = () => {
  const teamMembers = [
    { name: 'Nagasudhan T', linkedin: 'https://www.linkedin.com/in/naga-sudhan-36bb88339/' },
    { name: 'Sankarapandian A' },
    { name: 'Prajith S' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 text-center mb-8">
          About Us
        </h2>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-12">
            <div className="flex items-center mb-4">
                <RocketLaunchIcon className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Our Project: Resume Evaluator</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our project, the Resume Evaluator App, is designed to simplify and speed up the hiring process by automatically analyzing and evaluating resumes. The app can efficiently handle up to 1000 PDF resumes at once, making it easier for HR teams and recruiters to shortlist candidates quickly and accurately.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                Our goal is to bring efficiency, accuracy, and ease to recruitment, helping companies save time while focusing on what truly matters — finding the right talent.
            </p>
        </div>

        <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
                <UsersIcon className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Meet the Team</h3>
            </div>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            We are a team of passionate developers who came together to solve a real challenge faced by companies during recruitment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white dark:bg-slate-700/50 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 transform hover:scale-105 transition-transform duration-200">
                {member.linkedin ? (
                   <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                  >
                    {member.name}
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{member.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};