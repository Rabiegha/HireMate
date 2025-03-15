import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setTemplate, setColor, setStep } from '../../../store/slices/resumeSlice';
import templates from '../../../templates';

const colors = [
  { id: 'blue', class: 'bg-blue-600' },
  { id: 'green', class: 'bg-green-600' },
  { id: 'purple', class: 'bg-purple-600' },
  { id: 'red', class: 'bg-red-600' },
  { id: 'gray', class: 'bg-gray-600' },
];

const previewData = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Anderson',
    email: 'sarah.anderson@example.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahanderson',
  },
  professionalSummary: 'Senior Product Designer with 6+ years of experience',
  experiences: [
    {
      id: '1',
      jobTitle: 'Senior Product Designer',
      employer: 'Tech Solutions Inc.',
      city: 'San Francisco',
      startDate: '2020',
      endDate: '2024',
      currentlyWorking: true,
      description: 'Led the redesign of core products',
      contractType: 'full-time',
    },
  ],
  education: [
    {
      id: '1',
      school: 'Design Institute',
      location: 'San Francisco',
      degree: 'Master of Design',
      fieldOfStudy: 'Interactive Design',
      startDate: '2016',
      endDate: '2018',
      currentlyStudying: false,
    },
  ],
  skills: [
    { id: '1', name: 'UI/UX Design', level: 5 },
    { id: '2', name: 'Figma', level: 5 },
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
  ],
  customSections: [],
};

function TemplateSelection() {
  const dispatch = useDispatch();
  const { template, color } = useSelector((state: RootState) => state.resume);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Template</h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.values(templates).map((t) => {
            const Template = t.component;
            
            return (
              <button
                key={t.id}
                onClick={() => dispatch(setTemplate(t.id))}
                className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all ${
                  template === t.id 
                    ? 'ring-4 ring-blue-500 scale-[1.02]' 
                    : 'hover:ring-2 ring-gray-300 hover:scale-[1.01]'
                }`}
              >
                <div className="template-preview">
                  <div className="template-preview-content">
                    <div className="resume-page">
                      <Template data={{ ...previewData, color }} />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                  <p className="text-lg font-medium text-white">{t.name}</p>
                  <p className="text-sm text-gray-200">{t.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Color</h2>
        <div className="flex items-center space-x-6">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => dispatch(setColor(c.id))}
              className={`group relative flex flex-col items-center`}
            >
              <div className={`w-12 h-12 rounded-full ${c.class} transition-all ${
                color === c.id 
                  ? 'ring-4 ring-offset-4 ring-blue-500 scale-110' 
                  : 'hover:ring-2 hover:ring-offset-2 ring-gray-300 hover:scale-105'
              }`} />
              <span className={`mt-2 text-sm capitalize transition-colors ${
                color === c.id 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {c.id}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => dispatch(setStep(1))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default TemplateSelection;