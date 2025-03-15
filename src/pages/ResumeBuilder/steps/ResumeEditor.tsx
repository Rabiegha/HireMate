import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import ResumeLayout from '../../../components/resume/ResumeLayout';
import StartOptions from './StartOptions';
import CvUploadConfirmation from './CvUploadConfirmation';
import TemplateSelection from './TemplateSelection';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Languages from './Languages';
import AdditionalSections from './AdditionalSections';

function ResumeEditor() {
  const step = useSelector((state: RootState) => state.resume.step);
  const startOption = useSelector((state: RootState) => state.resume.startOption);

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