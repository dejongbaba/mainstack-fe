import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  DollarSign,
  Grid3X3,
  Home,
  Menu,
  MessageSquare,
  User,
  Users,
  X,
} from 'lucide-react';
import logo from '@/assets/mainstack-logo.png';
import { cn } from '@/lib/utils';
export function NavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_, setIsMobile] = useState(false);

  // Handle window resize to determine if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is typically tablet/small laptop
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('[data-menu-container]')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Navigation links data
  const navLinks = [
    {
      to: '/',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      activeProps: { className: 'text-white bg-gray-900 hover:text-gray-700' },
    },
    { to: '/', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    {
      to: '/revenue',
      label: 'Revenue',
      icon: <DollarSign className="w-4 h-4" />,
      activeProps: { className: 'text-white bg-gray-900' },
    },
    { to: '/', label: 'CRM', icon: <Users className="w-4 h-4" /> },
    { to: '/', label: 'Apps', icon: <Grid3X3 className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          'fixed z-10 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300',
          'lg:w-[calc(100%-64px)] lg:top-[10px] lg:left-1/2 lg:-translate-x-1/2 lg:rounded-full lg:px-6 lg:py-4',
          'w-full top-0 left-0 px-4 py-3'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 rounded-sm flex items-center justify-center">
              <img src={logo} className="w-[100px]" alt="Mainstack Logo" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex font-medium items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    activeProps={link.activeProps}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="flex items-center">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              data-menu-container
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed z-50 top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 "
            data-menu-container
          >
            <nav>
              <ul className="space-y-4">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 w-full"
                      activeProps={link.activeProps}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      <span className="text-base">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile User Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
