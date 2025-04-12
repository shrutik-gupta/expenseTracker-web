import React from 'react';
import { Bell, PieChart, Search, User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-purple-900 text-white px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <PieChart size={24} />
          <h1 className="text-xl font-bold">ExpenseTracker</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-purple-800 text-white rounded-full py-1 px-4 pl-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search size={16} className="absolute left-2 top-2 text-purple-300" />
          </div>
          <button className="hover:text-purple-300"><Bell size={20} /></button>
          <button className="hover:text-purple-300"><Settings size={20} /></button>
          <button className="flex items-center space-x-2 hover:text-purple-300">
            <User size={20} />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;