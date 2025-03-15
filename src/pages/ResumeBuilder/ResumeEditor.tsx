import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ResumeLayout from '../../components/resume/ResumeLayout';
import StartOptions from './steps/StartOptions';
import CvUploadConfirmation from './steps/CvUploadConfirmation';
import TemplateSelection from './steps/TemplateSelection';
import PersonalInfo from './steps/PersonalInfo';
import Experience from './steps/Experience';
import Education from './steps/Education';
import Skills from './steps/Skills';
import Languages from './steps/Languages';
import AdditionalSections from './steps/AdditionalSections';
import PreviewSection from './steps/PreviewSection';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning';

function ResumeEditor() {
  const step = useSelector((state: RootState) => state.resume.step);
  const startOption = useSelector((state: RootState) => state.resume.startOption);

  // Enable unsaved changes warning
  useUnsavedChangesWarning(true);

  const renderStep = () => {
    // Show start options first
    if (step === -1) {
      return <StartOptions />;
    }

    // If uploading CV, show confirmation page before template selection
    if (startOption === 'upload' && step === 0) {
      return <CvUploadConfirmation />;
    }

    // Regular steps
    switch (step) {
      case 0:
        return <TemplateSelection />;
      case 1:
        return <PersonalInfo />;
      case 2:
        return <Experience />;
      case 3:
        return <Education />;
      case 4:
        return <Skills />;
      case 5:
        return <Languages />;
      case 6:
        return <AdditionalSections />;
      case 7:
        return <PreviewSection />;
      default:
        return <StartOptions />;
    }
  };

  return (
    <ResumeLayout>
      {renderStep()}
    </ResumeLayout>
  );
}

export default ResumeEditor;