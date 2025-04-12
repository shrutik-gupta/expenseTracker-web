import React from 'react';
import { Home, Receipt } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-screen w-64 flex flex-col">
      <nav className="space-y-4 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 w-full p-2 rounded-md font-medium ${
              isActive ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/receipt"
          className={({ isActive }) =>
            `flex items-center space-x-2 w-full p-2 rounded-md font-medium ${
              isActive ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Receipt size={20} />
          <span>Receipt</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
