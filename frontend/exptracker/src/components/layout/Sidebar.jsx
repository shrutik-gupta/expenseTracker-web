import React, { useState } from 'react';
import { Home, Receipt, BarChart3, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="md:hidden p-4 bg-white shadow">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-white rounded-lg shadow p-4 w-64 flex flex-col fixed top-0 left-0 h-full z-50 transition-transform transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:flex md:h-screen md:translate-x-0`}
      >
        <nav className="space-y-4 flex-1 mt-16 md:mt-0">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 w-full p-2 rounded-md font-medium ${
                isActive
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-gray-600 hover:bg-gray-100'
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
                isActive
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Receipt size={20} />
            <span>Receipt</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center space-x-2 w-full p-2 rounded-md font-medium ${
                isActive
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </NavLink>
        </nav>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
