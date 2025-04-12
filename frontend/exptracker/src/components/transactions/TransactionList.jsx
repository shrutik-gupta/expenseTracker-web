import React, { useState } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import TransactionItem from './TransactionItem';

const TransactionList = () => {
  const { transactions } = useTransactions();
  const [currentView, setCurrentView] = useState('Today');
  
  // Handler for view button clicks
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
        
        <div className="flex space-x-2">
          <button 
            className={`py-2 px-4 rounded-lg ${currentView === 'Today' ? 'bg-purple-200 text-purple-900' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => handleViewChange('Today')}
          >
            Today
          </button>
          <button 
            className={`py-2 px-4 rounded-lg ${currentView === 'Weekly' ? 'bg-purple-200 text-purple-900' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => handleViewChange('Weekly')}
          >
            Weekly
          </button>
          <button 
            className={`py-2 px-4 rounded-lg ${currentView === 'Monthly' ? 'bg-purple-200 text-purple-900' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => handleViewChange('Monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-gray-500">Date</th>
              <th className="px-4 py-3 text-gray-500">Category</th>
              <th className="px-4 py-3 text-gray-500">Description</th>
              <th className="px-4 py-3 text-gray-500">Type</th>
              <th className="px-4 py-3 text-gray-500 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-gray-500 text-sm">Showing {transactions.length} of {transactions.length} transactions</p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 rounded bg-purple-200 text-purple-900">1</button>
          <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">2</button>
          <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">3</button>
          <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;