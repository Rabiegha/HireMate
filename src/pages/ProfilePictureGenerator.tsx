import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, RefreshCw, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface GeneratedImage {
  id: string;
  url: string;
}

function ProfilePictureGenerator() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [image, setImage] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
    } else {
      toast.error('Please upload a JPG or PNG file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setGeneratedImages([]);
    setSelectedImage(null);

    try {
      // TODO: Integrate with Stable Diffusion API
      // Mock response with placeholder images
      const mockImages: GeneratedImage[] = [
        { id: '1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
        { id: '2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
        { id: '3', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
        { id: '4', url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop' },
      ];

      setGeneratedImages(mockImages);
      toast.success('Images generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate images');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with Stable Diffusion API
      // Mock response with a new image
      const newImage = {
        id: Date.now().toString(),
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
      };
      setGeneratedImages((prev) => [...prev.slice(0, -1), newImage]);
      toast.success('New variation generated!');
    } catch (error: any) {
      toast.error('Failed to generate new variation');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedImage || !user) {
      toast.error('Please select an image to save');
      return;
    }

    setSaving(true);
    try {
      // Save the profile picture to the database
      const { error } = await supabase
        .from('profile_pictures')
        .insert([
          {
            user_id: user.id,
            url: selectedImage,
            is_current: true,
          },
        ]);

      if (error) throw error;

      toast.success('Profile picture saved successfully!');
      navigate('/profile-picture');
    } catch (error: any) {
      toast.error('Failed to save profile picture');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate Profile Picture</h1>
        <button
          onClick={() => navigate('/profile-picture')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to List</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center items-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {image ? (
                  <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                ) : (
                  <Upload className="w-12 h-12 mb-3 text-gray-400" />
                )}
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {image ? image.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG</p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!image || loading}
            className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4" />
                <span>Generate Images</span>
              </>
            )}
          </button>
        </form>
      </div>

      {generatedImages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Images</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRegenerateImage}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Generate New Variation</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedImage || saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Selected'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((genImage) => (
              <div
                key={genImage.id}
                onClick={() => setSelectedImage(genImage.url)}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                  selectedImage === genImage.url ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                <img
                  src={genImage.url}
                  alt="Generated headshot"
                  className="w-full h-full object-cover"
                />
                {selectedImage === genImage.url && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePictureGenerator;