import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addCustomSection, updateCustomSection, deleteCustomSection, setStep } from '../../../store/slices/resumeSlice';
import { generateId } from '../../../lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { useAutoSave } from '../../../hooks/useAutoSave';

function AdditionalSections() {
  const dispatch = useDispatch();
  const resumeData = useSelector((state: RootState) => state.resume);
  const customSections = useSelector((state: RootState) => state.resume.customSections);
  const [sectionTitle, setSectionTitle] = useState('');
  const [currentItem, setCurrentItem] = useState({
    title: '',
    description: '',
    date: '',
  });

  // Enable auto-save
  useAutoSave(resumeData.id);

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (sectionTitle.trim()) {
      dispatch(addCustomSection({
        id: generateId(),
        title: sectionTitle.trim(),
        items: [],
      }));
      setSectionTitle('');
    }
  };

  const handleAddItem = (sectionId: string) => {
    if (currentItem.title.trim()) {
      const section = customSections.find(s => s.id === sectionId);
      if (section) {
        dispatch(updateCustomSection({
          ...section,
          items: [...section.items, { ...currentItem, id: generateId() }],
        }));
        setCurrentItem({ title: '', description: '', date: '' });
      }
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    dispatch(deleteCustomSection(sectionId));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Additional Sections</h2>
      
      <form onSubmit={handleAddSection} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add New Section
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Enter section title"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Section
            </button>
          </div>
        </div>
      </form>

      {customSections.map((section) => (
        <div key={section.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
            <button
              onClick={() => handleDeleteSection(section.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                  {item.date && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
              </div>
            ))}

            <div className="space-y-2">
              <input
                type="text"
                value={currentItem.title}
                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Item title"
              />
              <input
                type="date"
                value={currentItem.date}
                onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <textarea
                value={currentItem.description}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Item description"
                rows={3}
              />
              <button
                onClick={() => handleAddItem(section.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => dispatch(setStep(5))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(setStep(7))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue to Preview
        </button>
      </div>
    </div>
  );
}

export default AdditionalSections;