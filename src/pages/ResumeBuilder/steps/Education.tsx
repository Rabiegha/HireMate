import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addEducation, updateEducation, deleteEducation, setStep } from '../../../store/slices/resumeSlice';
import { generateId } from '../../../lib/utils';
import { Plus, Trash2, Edit2 } from 'lucide-react';

function Education() {
  const dispatch = useDispatch();
  const education = useSelector((state: RootState) => state.resume.education);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    id: '',
    school: '',
    location: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    currentlyStudying: false,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateEducation(currentEducation));
    } else {
      dispatch(addEducation({ ...currentEducation, id: generateId() }));
    }
    resetForm();
  };

  const resetForm = () => {
    setCurrentEducation({
      id: '',
      school: '',
      location: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      description: '',
    });
    setIsEditing(false);
  };

  const handleEdit = (edu: typeof currentEducation) => {
    setCurrentEducation(edu);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEducation(id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              School/University
            </label>
            <input
              type="text"
              value={currentEducation.school}
              onChange={(e) => setCurrentEducation({ ...currentEducation, school: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={currentEducation.location}
              onChange={(e) => setCurrentEducation({ ...currentEducation, location: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Degree
            </label>
            <input
              type="text"
              value={currentEducation.degree}
              onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Field of Study
            </label>
            <input
              type="text"
              value={currentEducation.fieldOfStudy}
              onChange={(e) => setCurrentEducation({ ...currentEducation, fieldOfStudy: e.target.value })}
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={currentEducation.startDate}
              onChange={(e) => setCurrentEducation({ ...currentEducation, startDate: e.target.value })}
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
              value={currentEducation.endDate}
              onChange={(e) => setCurrentEducation({ ...currentEducation, endDate: e.target.value })}
              disabled={currentEducation.currentlyStudying}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="currentlyStudying"
            checked={currentEducation.currentlyStudying}
            onChange={(e) => setCurrentEducation({ ...currentEducation, currentlyStudying: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="currentlyStudying" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            I am currently studying here
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={currentEducation.description}
            onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
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
            {isEditing ? 'Update Education' : 'Add Education'}
          </button>
        </div>
      </form>

      {education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Added Education</h3>
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-start"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree} in {edu.fieldOfStudy}</h4>
                <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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
          onClick={() => dispatch(setStep(2))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(setStep(4))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next: Skills
        </button>
      </div>
    </div>
  );
}

export default Education;