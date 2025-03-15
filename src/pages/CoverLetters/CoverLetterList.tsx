import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import html2pdf from 'html2pdf.js';

interface CoverLetter {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

function CoverLetterList() {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const fetchCoverLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch cover letters');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (coverLetter: CoverLetter) => {
    try {
      const element = document.getElementById(`cover-letter-${coverLetter.id}`);
      if (!element) return;

      const opt = {
        margin: 1,
        filename: `${coverLetter.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Cover letter downloaded successfully');
    } catch (error) {
      toast.error('Failed to download cover letter');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) return;

    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCoverLetters(coverLetters.filter(letter => letter.id !== id));
      toast.success('Cover letter deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete cover letter');
    }
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cover Letters</h1>
        <Link
          to="/cover-letters/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Cover Letter</span>
        </Link>
      </div>

      {coverLetters.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No cover letters yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create your first cover letter to get started
          </p>
          <Link
            to="/cover-letters/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Cover Letter</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            <div className="space-y-4">
              {coverLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{letter.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last modified {formatDate(letter.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(letter)}
                      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      title="Download PDF"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/cover-letters/${letter.id}/edit`}
                      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      title="Edit"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(letter.id)}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverLetterList;