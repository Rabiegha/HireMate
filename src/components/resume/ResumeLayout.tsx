import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setStep } from '../../store/slices/resumeSlice';
import { FileText, Briefcase, GraduationCap, Languages, Award, User, Plus, X, Menu } from 'lucide-react';
import SidePreview from './SidePreview';
import FullScreenPreview from './FullScreenPreview';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  step: number;
}

const sidebarItems: SidebarItem[] = [
  { icon: <FileText className="h-5 w-5" />, label: 'Template', step: 0 },
  { icon: <User className="h-5 w-5" />, label: 'Personal Info', step: 1 },
  { icon: <Briefcase className="h-5 w-5" />, label: 'Experience', step: 2 },
  { icon: <GraduationCap className="h-5 w-5" />, label: 'Education', step: 3 },
  { icon: <Award className="h-5 w-5" />, label: 'Skills', step: 4 },
  { icon: <Languages className="h-5 w-5" />, label: 'Languages', step: 5 },
  { icon: <Plus className="h-5 w-5" />, label: 'Additional Sections', step: 6 },
];

interface ResumeLayoutProps {
  children: React.ReactNode;
}

function ResumeLayout({ children }: ResumeLayoutProps) {
  const currentStep = useSelector((state: RootState) => state.resume.step);
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile preview toggle */}
        <button
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          {isPreviewOpen ? <X className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resume Builder</h2>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    dispatch(setStep(item.step));
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentStep === item.step
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>

        {/* Live Preview */}
        <div
          className={`${
            isPreviewOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 fixed lg:relative inset-y-0 right-0 z-40 w-full md:w-96 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out`}
        >
          <SidePreview onFullscreen={() => setIsFullScreenPreview(true)} />
        </div>

        {/* Backdrop */}
        {(isSidebarOpen || isPreviewOpen) && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => {
              setIsSidebarOpen(false);
              setIsPreviewOpen(false);
            }}
          />
        )}
      </div>

      {/* Full Screen Preview */}
      {isFullScreenPreview && (
        <FullScreenPreview onClose={() => setIsFullScreenPreview(false)} />
      )}
    </>
  );
}

export default ResumeLayout;