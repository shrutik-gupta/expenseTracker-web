import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white mt-8 py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-500 text-sm md:text-base text-center md:text-left">© 2025 ExpenseTracker. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-purple-900 text-sm md:text-base">Terms</a>
            <a href="#" className="text-gray-500 hover:text-purple-900 text-sm md:text-base">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-purple-900 text-sm md:text-base">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;