import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  postalCode?: string;
  city?: string;
  dateOfBirth?: string;
  nationality?: string;
  drivingLicense?: string;
  linkedin?: string;
  profilePicture?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  contractType: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  location: string;
  degree: string;
  fieldOfStudy: string;
  distinction?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface Skill {
  id: string;
  name: string;
  level?: number;
}

export interface CustomSection {
  id: string;
  title: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    date?: string;
  }>;
}

interface ResumeState {
  id?: string;
  template: string;
  color: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  professionalSummary: string;
  customSections: CustomSection[];
  step: number;
  uploadedCv: {
    file: File | null;
    preview: string | null;
  };
  startOption: 'new' | 'upload' | null;
}

const initialState: ResumeState = {
  template: 'modern',
  color: 'blue',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  professionalSummary: '',
  customSections: [],
  step: -1, // -1 represents the start option selection
  uploadedCv: {
    file: null,
    preview: null,
  },
  startOption: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<string>) => {
      state.template = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setPersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experiences.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<Experience>) => {
      const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = action.payload;
      }
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
    },
    setExperiences: (state, action: PayloadAction<Experience[]>) => {
      state.experiences = action.payload;
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<Education>) => {
      const index = state.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = action.payload;
      }
    },
    deleteEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
    },
    setEducation: (state, action: PayloadAction<Education[]>) => {
      state.education = action.payload;
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },
    setLanguages: (state, action: PayloadAction<Language[]>) => {
      state.languages = action.payload;
    },
    setProfessionalSummary: (state, action: PayloadAction<string>) => {
      state.professionalSummary = action.payload;
    },
    addCustomSection: (state, action: PayloadAction<CustomSection>) => {
      state.customSections.push(action.payload);
    },
    updateCustomSection: (state, action: PayloadAction<CustomSection>) => {
      const index = state.customSections.findIndex(section => section.id === action.payload.id);
      if (index !== -1) {
        state.customSections[index] = action.payload;
      }
    },
    deleteCustomSection: (state, action: PayloadAction<string>) => {
      state.customSections = state.customSections.filter(section => section.id !== action.payload);
    },
    setCustomSections: (state, action: PayloadAction<CustomSection[]>) => {
      state.customSections = action.payload;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setUploadedCv: (state, action: PayloadAction<{ file: File | null; preview: string | null }>) => {
      state.uploadedCv = action.payload;
    },
    setStartOption: (state, action: PayloadAction<'new' | 'upload' | null>) => {
      state.startOption = action.payload;
    },
    setResumeId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    resetResume: () => initialState,
  },
});

export const {
  setTemplate,
  setColor,
  setPersonalInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  setExperiences,
  addEducation,
  updateEducation,
  deleteEducation,
  setEducation,
  setSkills,
  setLanguages,
  setProfessionalSummary,
  addCustomSection,
  updateCustomSection,
  deleteCustomSection,
  setCustomSections,
  setStep,
  setUploadedCv,
  setStartOption,
  setResumeId,
  resetResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;