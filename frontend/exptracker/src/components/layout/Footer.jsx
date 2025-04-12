import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white mt-8 py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">© 2025 ExpenseTracker. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-purple-900">Terms</a>
            <a href="#" className="text-gray-500 hover:text-purple-900">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-purple-900">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;