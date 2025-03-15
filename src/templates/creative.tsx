import React from 'react';
import { Template } from '../types';

const Creative: Template = {
  id: 'creative',
  name: 'Creative',
  description: 'A bold and modern design perfect for creative professionals',
  thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=400&fit=crop',
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
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600',
      red: 'bg-red-600',
      gray: 'bg-gray-600',
    };

    const sidebarColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
      <div className="min-h-[297mm] h-full bg-white grid grid-cols-3">
        {/* Sidebar */}
        <div className={`${sidebarColor} text-white p-8 h-full`}>
          {personalInfo.profilePicture && (
            <img
              src={personalInfo.profilePicture}
              alt="Profile"
              className="w-full aspect-square object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {personalInfo.firstName || ''}<br />{personalInfo.lastName || ''}
            </h1>
            <div className="space-y-2 text-gray-300">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.address}</p>
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <p className="text-sm font-medium">{skill.name}</p>
                    {skill.level && (
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Languages</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <p key={lang.id}>
                    {lang.name} - {lang.proficiency}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-8 h-full">
          {/* Professional Summary */}
          {professionalSummary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{professionalSummary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full" />
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.employer} - {exp.city}</p>
                    <p className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </p>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full" />
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school} - {edu.location}</p>
                    <p className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map((section) => (
            <section key={section.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full" />
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.date && (
                      <p className="text-gray-500 text-sm">{item.date}</p>
                    )}
                    <p className="text-gray-700 mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }
};

export default Creative;