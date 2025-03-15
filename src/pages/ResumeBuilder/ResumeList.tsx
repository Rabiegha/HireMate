import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Download, Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setTemplate, setColor, setPersonalInfo, setExperiences, setEducation, setSkills, setLanguages, setProfessionalSummary, setCustomSections, setResumeId } from '../../store/slices/resumeSlice';
import html2pdf from 'html2pdf.js';
import templates from '../../templates';

interface Resume {
  id: string;
  title: string;
  content: any;
  created_at: string;
  updated_at: string;
}

function ResumeList() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const element = document.getElementById(`resume-${resume.id}`);
      if (!element) return;

      const opt = {
        margin: 0,
        filename: `${resume.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResumes(resumes.filter(resume => resume.id !== id));
      toast.success('Resume deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete resume');
    }
  };

  const handleEdit = (resume: Resume) => {
    // Load resume data into Redux store
    const content = resume.content;
    dispatch(setResumeId(resume.id));
    dispatch(setTemplate(content.template || 'modern'));
    dispatch(setColor(content.color || 'blue'));
    dispatch(setPersonalInfo(content.personalInfo || {}));
    dispatch(setExperiences(content.experiences || []));
    dispatch(setEducation(content.education || []));
    dispatch(setSkills(content.skills || []));
    dispatch(setLanguages(content.languages || []));
    dispatch(setProfessionalSummary(content.professionalSummary || ''));
    dispatch(setCustomSections(content.customSections || []));

    // Navigate to the editor
    navigate(`/resume-builder/${resume.id}/edit`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
        <Link
          to="/resume-builder/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Resume</span>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No resumes yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create your first resume to get started
          </p>
          <Link
            to="/resume-builder/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Resume</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const Template = templates[resume.content?.template || 'modern'].component;
            
            return (
              <div
                key={resume.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                {/* Resume Preview */}
                <div className="relative h-[400px] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  <div className="preview-container scale-preview">
                    <div className="resume-content" id={`resume-${resume.id}`}>
                      <Template data={resume.content} />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-800" />
                </div>

                {/* Resume Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">{resume.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last modified {formatDate(resume.updated_at)}
                  </p>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleDownload(resume)}
                      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      title="Download PDF"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(resume)}
                      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      title="Edit"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ResumeList;