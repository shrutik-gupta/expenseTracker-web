import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

const Receipt = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'today', 'weekly', 'monthly'

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/expenses');
      const data = await response.json();
      const receiptsOnly = data.filter(item => item.receiptImage);
      setExpenses(receiptsOnly);
      setFilteredExpenses(receiptsOnly);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter expenses based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredExpenses(expenses);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      
      if (activeFilter === 'today') {
        return expenseDate.getTime() === today.getTime();
      }
      
      if (activeFilter === 'weekly') {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return expenseDate >= oneWeekAgo && expenseDate <= today;
      }
      
      if (activeFilter === 'monthly') {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return expenseDate >= oneMonthAgo && expenseDate <= today;
      }
      
      return true;
    });
    
    setFilteredExpenses(filtered);
  }, [activeFilter, expenses]);

  const getFilterButtonClass = (filter) => {
    return `px-2 py-2 sm:px-4 text-sm sm:text-base rounded-lg ${
      activeFilter === filter 
        ? 'bg-purple-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    } transition-colors duration-200 cursor-pointer flex-1 text-center`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="text-purple-600" size={24} />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Receipts</h1>
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 sm:space-x-4">
        <button 
          className={getFilterButtonClass('all')}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={getFilterButtonClass('today')}
          onClick={() => setActiveFilter('today')}
        >
          Today
        </button>
        <button 
          className={getFilterButtonClass('weekly')}
          onClick={() => setActiveFilter('weekly')}
        >
          Weekly
        </button>
        <button 
          className={getFilterButtonClass('monthly')}
          onClick={() => setActiveFilter('monthly')}
        >
          Monthly
        </button>
      </div>
      
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <FileText className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-500 text-base sm:text-lg">
            {activeFilter === 'all' 
              ? 'No receipts found' 
              : `No receipts found for the selected period (${activeFilter})`}
          </p>
          <p className="text-gray-400 text-sm sm:text-base">Upload receipts to see them here</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredExpenses.map((item, index) => (
            <div
              key={index}
              className="flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-48 sm:h-auto md:h-60 bg-gray-50 flex items-center justify-center p-3 sm:p-4">
                <img
                  src={`http://localhost:3000/${item.receiptImage}`}
                  alt="Receipt"
                  className="max-h-40 sm:max-h-60 w-full object-contain rounded"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">
                    <FileText className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{item.category}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-4 space-y-2">
                  <p className="text-sm sm:text-base text-gray-700">{item.description}</p>
                  <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-500">Amount</span>
                    <span className="text-base sm:text-lg font-bold text-purple-600">₹{item.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Receipt;