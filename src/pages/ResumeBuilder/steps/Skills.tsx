import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSkills, setStep } from '../../../store/slices/resumeSlice';
import { generateId } from '../../../lib/utils';
import { Plus, X } from 'lucide-react';
import type { Skill } from '../../../store/slices/resumeSlice';

function Skills() {
  const dispatch = useDispatch();
  const skills = useSelector((state: RootState) => state.resume.skills);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const skill: Skill = {
      id: generateId(),
      name: newSkill.trim(),
      level: skillLevel,
    };

    dispatch(setSkills([...skills, skill]));
    setNewSkill('');
    setSkillLevel(3);
  };

  const handleRemoveSkill = (id: string) => {
    dispatch(setSkills(skills.filter(skill => skill.id !== id)));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>

      <form onSubmit={handleAddSkill} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g., JavaScript, Project Management"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proficiency Level
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={skillLevel}
              onChange={(e) => setSkillLevel(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </form>

      {skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Added Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
              >
                <span>{skill.name}</span>
                <div className="flex space-x-1">
                  {Array.from({ length: skill.level || 0 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-blue-800 dark:bg-blue-200"
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100"
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
          onClick={() => dispatch(setStep(3))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(setStep(5))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next: Languages
        </button>
      </div>
    </div>
  );
}

export default Skills;