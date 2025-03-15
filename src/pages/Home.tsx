import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, MessageSquare, Image } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Your AI-Powered Career Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Create professional resumes, ace interviews, and land your dream job with HireMate's
          AI-powered tools.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/pricing"
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            View Pricing
          </Link>
        </div>
      </section>

      <section className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Our Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/resume-builder">
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Resume Builder"
              description="Create professional resumes tailored to your industry and experience level."
            />
          </Link>
          <Link to="/job-matcher">
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Job Match Analysis"
              description="Get instant feedback on how well your profile matches job requirements."
            />
          </Link>
          <Link to="/interview-coach">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="Interview Coach"
              description="Practice interviews with AI feedback to improve your performance."
            />
          </Link>
          <Link to="/profile-picture">
            <FeatureCard
              icon={<Image className="h-8 w-8" />}
              title="Profile Pictures"
              description="Generate professional headshots for your career profiles."
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default Home;