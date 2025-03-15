import React from 'react';
import { Template } from '../types';

const Modern: Template = {
  id: 'modern',
  name: 'Modern',
  description: 'A clean and contemporary design with a focus on visual hierarchy',
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
      <div className="min-h-[297mm] h-full grid grid-cols-3">
        {/* Left Sidebar */}
        <div className={`col-span-1 ${sidebarColor} h-full text-white`}>
          <div className="p-8 h-full">
            <div className="w-32 h-32 mx-auto rounded-full bg-white/10 flex items-center justify-center overflow-hidden mb-6">
              {personalInfo.profilePicture ? (
                <img
                  src={personalInfo.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white/60 text-sm text-center">
                  Profile Photo
                </div>
              )}
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">
                {personalInfo.firstName || 'First'} {personalInfo.lastName || 'Last'}
              </h1>
              <div className="text-white/80 mt-2">
                <p>{personalInfo.email || 'email@example.com'}</p>
                <p>{personalInfo.phone || '+1 234 567 890'}</p>
                <p>{personalInfo.address || 'City, Country'}</p>
                {personalInfo.linkedin && (
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Skills</h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        {skill.level && (
                          <span className="text-white/60">
                            {Array(skill.level).fill('●').join(' ')}
                          </span>
                        )}
                      </div>
                      {skill.level && (
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div
                            className="bg-white h-1.5 rounded-full"
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Languages</h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between">
                      <span>{lang.name}</span>
                      <span className="text-white/60">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-2 bg-white p-8 h-full">
          {/* Professional Summary */}
          {professionalSummary && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {professionalSummary}
              </p>
            </section>
          )}

          {/* Experience Section */}
          {experiences.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="font-semibold text-gray-900">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-gray-600">
                      {exp.employer} - {exp.city}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </p>
                    <p className="text-gray-700 mt-2">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                    <p className="text-gray-600">
                      {edu.school} - {edu.location}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map((section) => (
            <section key={section.id} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.date && (
                      <p className="text-gray-500 text-sm">
                        {item.date}
                      </p>
                    )}
                    <p className="text-gray-700 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  },
};

export default Modern;