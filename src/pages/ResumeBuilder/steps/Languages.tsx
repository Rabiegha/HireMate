import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setLanguages, setStep } from '../../../store/slices/resumeSlice';
import { generateId } from '../../../lib/utils';
import { Plus, X } from 'lucide-react';
import type { Language } from '../../../store/slices/resumeSlice';

const proficiencyLevels = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const;

function Languages() {
  const dispatch = useDispatch();
  const languages = useSelector((state: RootState) => state.resume.languages);
  const [newLanguage, setNewLanguage] = useState('');
  const [proficiency, setProficiency] = useState<typeof proficiencyLevels[number]>('Advanced');

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLanguage.trim()) return;

    const language: Language = {
      id: generateId(),
      name: newLanguage.trim(),
      proficiency,
    };

    dispatch(setLanguages([...languages, language]));
    setNewLanguage('');
    setProficiency('Advanced');
  };

  const handleRemoveLanguage = (id: string) => {
    dispatch(setLanguages(languages.filter(lang => lang.id !== id)));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Languages</h2>

      <form onSubmit={handleAddLanguage} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g., English, Spanish"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proficiency
            </label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as typeof proficiencyLevels[number])}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              {proficiencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Language</span>
        </button>
      </form>

      {languages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Added Languages</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <div
                key={language.id}
                className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full"
              >
                <span>{language.name}</span>
                <span className="text-sm">({language.proficiency})</span>
                <button
                  onClick={() => handleRemoveLanguage(language.id)}
                  className="text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => dispatch(setStep(4))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(setStep(6))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next: Additional Sections
        </button>
      </div>
    </div>
  );
}

export default Languages;