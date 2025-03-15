import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, Plus, Check } from 'lucide-react';
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

function ProfilePictureMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [pictures, setPictures] = useState<ProfilePicture[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const currentPicture = pictures.find(pic => pic.is_current);

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

      toast.success('Profile picture updated');
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {currentPicture ? (
          <img
            src={currentPicture.url}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <Image className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Pictures</h3>
              <Link
                to="/profile-picture"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : pictures.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No profile pictures yet</p>
                <Link
                  to="/profile-picture"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Generate your first profile picture
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {pictures.map((picture) => (
                  <div
                    key={picture.id}
                    className="relative group aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={picture.url}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSetCurrent(picture.id)}
                          className="p-1 text-white hover:text-blue-400"
                          title="Set as current"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(picture.id)}
                          className="p-1 text-white hover:text-red-400"
                          title="Delete"
                        >
                          <Image className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {picture.is_current && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePictureMenu