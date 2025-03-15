import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

function Section({ title, children, actions }: SectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

export default Section;