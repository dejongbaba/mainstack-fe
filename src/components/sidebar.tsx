import { Link2, Bookmark, FileText, User } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="space-y-6">
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Link2 className="w-5 h-5 text-gray-600" />
        </button>

        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Bookmark className="w-5 h-5 text-gray-600" />
        </button>

        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
          <FileText className="w-5 h-5 text-gray-600" />
        </button>

        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
