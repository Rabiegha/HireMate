import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { RootState } from '../../store';
import { Save, ArrowLeft } from 'lucide-react';

interface CoverLetterData {
  title: string;
  company: string;
  position: string;
  content: string;
}

function CoverLetterEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<CoverLetterData>({
    title: '',
    company: '',
    position: '',
    content: '',
  });

  // Enable unsaved changes warning
  useUnsavedChangesWarning(hasUnsavedChanges);

  useEffect(() => {
    if (id) {
      fetchCoverLetter();
    }
  }, [id]);

  const fetchCoverLetter = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          company: data.company || '',
          position: data.position || '',
          content: data.content.text || '',
        });
      }
    } catch (error: any) {
      toast.error('Failed to load cover letter');
      navigate('/cover-letters');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const coverLetterData = {
        user_id: user.id,
        title: formData.title,
        company: formData.company,
        position: formData.position,
        content: { text: formData.content },
      };

      if (id) {
        // Update existing cover letter
        const { error } = await supabase
          .from('cover_letters')
          .update(coverLetterData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Cover letter updated successfully');
      } else {
        // Create new cover letter
        const { error } = await supabase
          .from('cover_letters')
          .insert([coverLetterData]);

        if (error) throw error;
        toast.success('Cover letter created successfully');
      }

      setHasUnsavedChanges(false);
      navigate('/cover-letters');
    } catch (error: any) {
      toast.error(id ? 'Failed to update cover letter' : 'Failed to create cover letter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? 'Edit Cover Letter' : 'Create Cover Letter'}
        </h1>
        <button
          onClick={() => navigate('/cover-letters')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to List</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="e.g., Software Developer Application - Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Position Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={12}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Write your cover letter content here..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Cover Letter'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CoverLetterEditor;