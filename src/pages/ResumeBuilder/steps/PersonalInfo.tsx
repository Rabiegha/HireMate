import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setPersonalInfo, setStep } from '../../../store/slices/resumeSlice';
import type { PersonalInfo as PersonalInfoType } from '../../../store/slices/resumeSlice';
import { Upload } from 'lucide-react';

function PersonalInfo() {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.resume.personalInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setPersonalInfo({ ...personalInfo, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setPersonalInfo({ ...personalInfo, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setStep(2));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName || ''}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName || ''}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={personalInfo.email || ''}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone || ''}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={personalInfo.address || ''}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={personalInfo.city || ''}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedin"
            value={personalInfo.linkedin || ''}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Picture
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="profile-photo"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="profile-photo"
                    name="profile-photo"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => dispatch(setStep(0))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

export default PersonalInfo;