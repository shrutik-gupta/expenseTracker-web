import React from 'react';
import { Home, Receipt, PieChart, Bell } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-screen w-64 flex flex-col">
      <nav className="space-y-4 flex-1">
        <button className="flex items-center space-x-2 w-full p-2 bg-purple-100 rounded-md text-purple-900 font-medium">
          <Home size={20} />
          <span>Dashboard</span>
        </button>
        <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-md text-gray-600">
          <Receipt size={20} />
          <span>Receipt</span>
        </button>
      </nav>
    </div>
  );
};


export default Sidebar;