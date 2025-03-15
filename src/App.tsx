import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder/index';
import CoverLetters from './pages/CoverLetters/index';
import JobMatcher from './pages/JobMatcher';
import InterviewCoach from './pages/InterviewCoach/index';
import ProfilePicture from './pages/ProfilePicture';
import ProfilePictureGenerator from './pages/ProfilePictureGenerator';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/resume-builder/*"
                element={
                  <AuthGuard>
                    <ResumeBuilder />
                  </AuthGuard>
                }
              />
              <Route
                path="/cover-letters/*"
                element={
                  <AuthGuard>
                    <CoverLetters />
                  </AuthGuard>
                }
              />
              <Route
                path="/job-matcher"
                element={
                  <AuthGuard>
                    <JobMatcher />
                  </AuthGuard>
                }
              />
              <Route
                path="/interview-coach"
                element={
                  <AuthGuard>
                    <InterviewCoach />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile-picture"
                element={
                  <AuthGuard>
                    <ProfilePicture />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile-picture/new"
                element={
                  <AuthGuard>
                    <ProfilePictureGenerator />
                  </AuthGuard>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </Provider>
  );
}

export default App;