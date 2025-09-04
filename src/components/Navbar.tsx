import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, UserCircle, LogOut, Edit, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onBookConsultation: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookConsultation }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const exploreDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target as Node)) {
        setIsExploreDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Close dropdowns on route change
  useEffect(() => {
    setIsExploreDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);


  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const exploreLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Our Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
  ];

  const userLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    ...(profile?.role === 'admin' ? [{ name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard }] : []),
    ...(profile?.role === 'admin' ? [{ name: 'Create Post', path: '/admin/create-post', icon: Edit }] : []),
  ];

  const NavLink: React.FC<{ to: string; children: React.ReactNode; }> = ({ to, children }) => (
    <Link
      to={to}
      className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        location.pathname === to ? 'text-blue-600 bg-blue-50' : ''
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://storage.googleapis.com/dualite-testing-424108.appspot.com/images%2F1756977508499-logo.png_1756977511059.png" alt="DigitalNexCode Logo" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            
            {/* Explore Dropdown */}
            <div className="relative" ref={exploreDropdownRef}>
              <button
                onClick={() => setIsExploreDropdownOpen(prev => !prev)}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Explore <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExploreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExploreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                  >
                    {exploreLinks.map(link => (
                      <Link key={link.path} to={link.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/invoice-generator">Invoice Generator</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          {/* Auth & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button onClick={() => setIsUserDropdownOpen(prev => !prev)} className="flex items-center space-x-2">
                  <UserCircle className="h-8 w-8 text-gray-600" />
                </button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 py-1"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || user.email}</p>
                        <p className="text-xs text-gray-500">{profile?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                      </div>
                      <div className="py-1">
                        {userLinks.map(link => (
                           <Link key={link.path} to={link.path} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                             <link.icon className="h-4 w-4 mr-3 text-gray-500" />
                             {link.name}
                           </Link>
                        ))}
                      </div>
                      <div className="py-1 border-t">
                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/login">Login</NavLink>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Sign Up
                </Link>
              </div>
            )}
             <button
              onClick={onBookConsultation}
              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600"
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink to="/">Home</NavLink>
              {exploreLinks.map(link => (
                <NavLink key={link.path} to={link.path}>{link.name}</NavLink>
              ))}
              <NavLink to="/pricing">Pricing</NavLink>
              <NavLink to="/invoice-generator">Invoice Generator</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <div className="border-t my-2"></div>
              {user ? (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  {profile?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                </>
              )}
              <button
                onClick={onBookConsultation}
                className="w-full text-center bg-green-500 text-white mt-2 px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
              >
                Book Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
