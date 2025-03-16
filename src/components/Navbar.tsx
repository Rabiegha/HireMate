import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Briefcase, FileText, Mail, MessageSquare, Phone, Image, Target, Menu, X, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { setUser } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { toast } from 'sonner';
import { logoutUser } from '../services/authService';

function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
        await logoutUser(dispatch);
        toast.success('Logged out successfully');
    } catch (error: any) {
        toast.error(error.message);
    }
};

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">HireMate</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <NavLink to="/resume-builder" icon={<FileText className="h-4 w-4" />}>
                  CVs
                </NavLink>
                <NavLink to="/cover-letters" icon={<Mail className="h-4 w-4" />}>
                  Cover Letters
                </NavLink>
                <NavLink to="/job-matcher" icon={<Target className="h-4 w-4" />}>
                  Job Match
                </NavLink>
                <NavLink to="/interview-coach" icon={<MessageSquare className="h-4 w-4" />}>
                  Interviews
                </NavLink>
                <NavLink to="/profile-picture" icon={<Image className="h-4 w-4" />}>
                  Profile Picture
                </NavLink>
                <NavLink to="/contact" icon={<Phone className="h-4 w-4" />}>
                  Contact Us
                </NavLink>
                <NavLink to="/pricing" icon={<CreditCard className="h-4 w-4" />}>
                  Subscription
                </NavLink>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <MobileNavLink to="/resume-builder" icon={<FileText className="h-4 w-4" />} onClick={closeMenu}>
                    CVs
                  </MobileNavLink>
                  <MobileNavLink to="/cover-letters" icon={<Mail className="h-4 w-4" />} onClick={closeMenu}>
                    Cover Letters
                  </MobileNavLink>
                  <MobileNavLink to="/job-matcher" icon={<Target className="h-4 w-4" />} onClick={closeMenu}>
                    Job Match
                  </MobileNavLink>
                  <MobileNavLink to="/interview-coach" icon={<MessageSquare className="h-4 w-4" />} onClick={closeMenu}>
                    Interviews
                  </MobileNavLink>
                  <MobileNavLink to="/profile-picture" icon={<Image className="h-4 w-4" />} onClick={closeMenu}>
                    Profile Picture
                  </MobileNavLink>
                  <MobileNavLink to="/contact" icon={<Phone className="h-4 w-4" />} onClick={closeMenu}>
                    Contact Us
                  </MobileNavLink>
                  <MobileNavLink to="/pricing" icon={<CreditCard className="h-4 w-4" />} onClick={closeMenu}>
                    Subscription
                  </MobileNavLink>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/pricing"
                    className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={closeMenu}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavLink({ to, icon, children }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 transition-colors ${
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ to, icon, children, onClick }: MobileNavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default Navbar;