import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, ArrowLeft, Save } from 'lucide-react';
import ResumePreview from '../../../components/resume/ResumePreview';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { setResumeId } from '../../../store/slices/resumeSlice';

function PreviewSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resumeData = useSelector((state: RootState) => state.resume);
  const user = useSelector((state: RootState) => state.auth.user);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save your resume');
      return;
    }

    setSaving(true);
    try {
      const resumeContent = {
        template: resumeData.template,
        color: resumeData.color,
        personalInfo: resumeData.personalInfo,
        experiences: resumeData.experiences,
        education: resumeData.education,
        skills: resumeData.skills,
        languages: resumeData.languages,
        professionalSummary: resumeData.professionalSummary,
        customSections: resumeData.customSections,
      };

      if (resumeData.id) {
        // Update existing resume
        const { error } = await supabase
          .from('resumes')
          .update({
            content: resumeContent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', resumeData.id);

        if (error) throw error;
        toast.success('Resume updated successfully!');
      } else {
        // Create new resume
        const { data, error } = await supabase
          .from('resumes')
          .insert([
            {
              user_id: user.id,
              title: `${resumeData.personalInfo.firstName || 'Untitled'}'s Resume`,
              content: resumeContent,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          dispatch(setResumeId(data.id));
        }
        toast.success('Resume saved successfully!');
      }

      navigate('/resume-builder');
    } catch (error: any) {
      toast.error('Failed to save resume');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${resumeData.personalInfo.firstName}'s Resume`,
        text: 'Check out my resume!',
        url: window.location.href,
      });
    } catch (error) {
      toast.error('Unable to share. Your browser might not support sharing.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview Your Resume</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Resume'}</span>
          </button>
          <button
            onClick={() => {
              const previewElement = document.querySelector('.resume-preview');
              if (previewElement) {
                const downloadButton = previewElement.querySelector('[title="Download PDF"]');
                if (downloadButton instanceof HTMLElement) {
                  downloadButton.click();
                }
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => navigate('/resume-builder')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to List</span>
          </button>
        </div>
      </div>

      <div className="resume-preview bg-gray-100 dark:bg-gray-900 rounded-lg p-8">
        <ResumePreview isFullPage={true} />
      </div>
    </div>
  );
}

export default PreviewSection;