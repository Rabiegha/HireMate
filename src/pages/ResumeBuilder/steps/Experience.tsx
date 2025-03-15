import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addExperience, updateExperience, deleteExperience, setStep } from '../../../store/slices/resumeSlice';
import { generateId } from '../../../lib/utils';
import { Plus, Trash2, Edit2 } from 'lucide-react';

function Experience() {
  const dispatch = useDispatch();
  const experiences = useSelector((state: RootState) => state.resume.experiences);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    id: '',
    jobTitle: '',
    employer: '',
    city: '',
    contractType: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateExperience(currentExperience));
    } else {
      dispatch(addExperience({ ...currentExperience, id: generateId() }));
    }
    resetForm();
  };

  const resetForm = () => {
    setCurrentExperience({
      id: '',
      jobTitle: '',
      employer: '',
      city: '',
      contractType: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    });
    setIsEditing(false);
  };

  const handleEdit = (experience: typeof currentExperience) => {
    setCurrentExperience(experience);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteExperience(id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Experience</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={currentExperience.jobTitle}
              onChange={(e) => setCurrentExperience({ ...currentExperience, jobTitle: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employer
            </label>
            <input
              type="text"
              value={currentExperience.employer}
              onChange={(e) => setCurrentExperience({ ...currentExperience, employer: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={currentExperience.city}
              onChange={(e) => setCurrentExperience({ ...currentExperience, city: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contract Type
            </label>
            <select
              value={currentExperience.contractType}
              onChange={(e) => setCurrentExperience({ ...currentExperience, contractType: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">Select type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={currentExperience.startDate}
              onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={currentExperience.endDate}
              onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
              disabled={currentExperience.currentlyWorking}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="currentlyWorking"
            checked={currentExperience.currentlyWorking}
            onChange={(e) => setCurrentExperience({ ...currentExperience, currentlyWorking: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="currentlyWorking" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            I currently work here
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={currentExperience.description}
            onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
            rows={4}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Update Experience' : 'Add Experience'}
          </button>
        </div>
      </form>

      {experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Added Experiences</h3>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-start"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{exp.jobTitle}</h4>
                <p className="text-gray-600 dark:text-gray-400">{exp.employer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => dispatch(setStep(1))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(setStep(3))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next: Education
        </button>
      </div>
    </div>
  );
}

export default Experience;