import React from 'react';
import { Template } from '../types';

const Classic: Template = {
  id: 'classic',
  name: 'Classic',
  description: 'A traditional and professional design suitable for all industries',
  thumbnail: 'https://images.unsplash.com/photo-1586281380117-8c2eadb2d094?w=300&h=400&fit=crop',
  component: ({ data }) => {
    const {
      personalInfo = {},
      professionalSummary = '',
      experiences = [],
      education = [],
      skills = [],
      languages = [],
      customSections = [],
      color = 'blue',
    } = data || {};

    const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
      gray: 'text-gray-600',
    };

    const accentColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
      <div className="min-h-[297mm] h-full bg-white p-8">
        {/* Header */}
        <header className="text-center mb-8 border-b pb-6">
          <h1 className={`text-3xl font-bold ${accentColor} mb-2`}>
            {personalInfo.firstName || ''} {personalInfo.lastName || ''}
          </h1>
          <div className="text-gray-600">
            <p>{personalInfo.email} • {personalInfo.phone}</p>
            <p>{personalInfo.address}</p>
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${accentColor} hover:underline`}
              >
                LinkedIn Profile
              </a>
            )}
          </div>
          {personalInfo.profilePicture && (
            <img
              src={personalInfo.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto mt-4"
            />
          )}
        </header>

        {/* Professional Summary */}
        {professionalSummary && (
          <section className="mb-8">
            <h2 className={`text-xl font-bold ${accentColor} border-b pb-2 mb-3`}>
              Professional Summary
            </h2>
            <p className="text-gray-700">{professionalSummary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-8">
            <h2 className={`text-xl font-bold ${accentColor} border-b pb-2 mb-3`}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-gray-600">{exp.employer} - {exp.city}</p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className={`text-xl font-bold ${accentColor} border-b pb-2 mb-3`}>
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school} - {edu.location}</p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold ${accentColor} border-b pb-2 mb-3`}>
                Skills
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {skills.map((skill) => (
                  <li key={skill.id} className="text-gray-700">
                    {skill.name}
                    {skill.level && (
                      <span className="text-gray-500 ml-2">
                        ({Array(skill.level).fill('•').join('')})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold ${accentColor} border-b pb-2 mb-3`}>
                Languages
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {languages.map((lang) => (
                  <li key={lang.id} className="text-gray-700">
                    {lang.name} - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Custom Sections */}
        {customSections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className={`text-xl font-bold ${accentColor} border-b pb-2 mb-3`}>
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.id}>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.date && (
                    <p className="text-gray-500 text-sm">{item.date}</p>
                  )}
                  <p className="text-gray-700 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

export default Classic;