import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, MessageSquare, Image } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          What would you like to work on today?
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/resume-builder"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-blue-600 dark:text-blue-400 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Resume Builder</h3>
          <p className="text-gray-600 dark:text-gray-300">Create a professional resume with our enhanced builder</p>
        </Link>
        
        <Link
          to="/job-matcher"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-blue-600 dark:text-blue-400 mb-4">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Job Match Analysis</h3>
          <p className="text-gray-600 dark:text-gray-300">Compare your profile with job requirements</p>
        </Link>
        
        <Link
          to="/interview-coach"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-blue-600 dark:text-blue-400 mb-4">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interview Coach</h3>
          <p className="text-gray-600 dark:text-gray-300">Practice your interview skills</p>
        </Link>
        
        <Link
          to="/profile-picture"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-blue-600 dark:text-blue-400 mb-4">
            <Image className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Picture</h3>
          <p className="text-gray-600 dark:text-gray-300">Generate a professional headshot</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;