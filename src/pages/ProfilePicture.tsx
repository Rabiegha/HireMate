import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon, Trash2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { toast } from 'sonner';

interface ProfilePicture {
  id: string;
  url: string;
  is_current: boolean;
  created_at: string;
}

function ProfilePicture() {
  const [pictures, setPictures] = useState<ProfilePicture[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchProfilePictures();
    }
  }, [user]);

  const fetchProfilePictures = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_pictures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPictures(data || []);
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      // First, set all pictures to not current
      await supabase
        .from('profile_pictures')
        .update({ is_current: false })
        .eq('user_id', user?.id);

      // Then set the selected picture as current
      const { error } = await supabase
        .from('profile_pictures')
        .update({ is_current: true })
        .eq('id', id);

      if (error) throw error;

      setPictures(pictures.map(pic => ({
        ...pic,
        is_current: pic.id === id
      })));

      toast.success('Profile picture set as current');
    } catch (error) {
      toast.error('Failed to update profile picture');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile picture?')) return;

    try {
      const { error } = await supabase
        .from('profile_pictures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPictures(pictures.filter(pic => pic.id !== id));
      toast.success('Profile picture deleted');
    } catch (error) {
      toast.error('Failed to delete profile picture');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Pictures</h1>
        <Link
          to="/profile-picture/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Picture</span>
        </Link>
      </div>

      {pictures.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No profile pictures yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Generate your first professional profile picture
          </p>
          <Link
            to="/profile-picture/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Picture</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {pictures.map((picture) => (
                <div
                  key={picture.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={picture.url}
                      alt="Profile picture"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Generated on {formatDate(picture.created_at)}
                      </p>
                      {picture.is_current && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Current Picture
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!picture.is_current && (
                      <button
                        onClick={() => handleSetCurrent(picture.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        title="Set as current"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(picture.id)}
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

export default ProfilePicture;