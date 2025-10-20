import { Link } from '@tanstack/react-router';
import {
  BarChart3,
  Bell,
  DollarSign,
  Grid3X3,
  Home,
  MessageSquare,
  User,
  Users,
} from 'lucide-react';

export function NavigationMenu() {
  return (
    <>
      {/* Header */}
      <header className="fixed w-[calc(100%-64px)] top-[10px] left-1/2 -translate-x-1/2 z-10 border-b  bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <nav className="">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  activeProps={{ className: 'text-gray-900' }}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/revenue"
                  className="flex items-center space-x-2 px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  activeProps={{ className: 'text-white bg-gray-900' }}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Revenue</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <Users className="w-4 h-4" />
                  <span>CRM</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Apps</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
