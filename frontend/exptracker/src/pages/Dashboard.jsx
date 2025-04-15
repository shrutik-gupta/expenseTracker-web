import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceCard from '../components/dashboard/BalanceCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'today', 'weekly', 'monthly'

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/expenses');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setExpenses(data);
        setFilteredExpenses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch expenses. ' + err.message);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch expenses
        const expenseRes = await fetch('http://localhost:3000/api/expenses');
        if (!expenseRes.ok) throw new Error("Expense fetch error");
        const expenseData = await expenseRes.json();
        setExpenses(expenseData);
        setFilteredExpenses(expenseData);
        const expenseSum = expenseData.reduce((acc, cur) => acc + parseFloat(cur.amount), 0);
        setExpenseTotal(expenseSum);

        // Fetch income total
        const incomeRes = await fetch('http://localhost:3000/api/income/total');
        if (!incomeRes.ok) throw new Error("Income fetch error");
        const incomeData = await incomeRes.json();
        setIncomeTotal(incomeData.totalIncome);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update expenseTotal whenever expenses change
  useEffect(() => {
    const newExpenseTotal = expenses.reduce((acc, cur) => acc + parseFloat(cur.amount), 0);
    setExpenseTotal(newExpenseTotal);
  }, [expenses]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete. Status: ${response.status}`);
      }

      // Find the expense amount before deleting
      const expenseToDelete = expenses.find(exp => exp._id === id);
      
      // Remove the deleted expense from state
      const updatedExpenses = expenses.filter(exp => exp._id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      setError('Failed to delete expense. ' + err.message);
    }
  };

  const getFilterButtonClass = (filter) => {
    return `px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg ${
      activeFilter === filter 
        ? 'bg-purple-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    } transition-colors duration-200 cursor-pointer`;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-full">
      <div className="flex flex-col items-center justify-center w-full px-2 sm:px-6 mb-6">
        <div className="w-full mb-4 text-start">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-700">
            Current Balance: ₹{(incomeTotal - expenseTotal).toFixed(2)}
          </h2>
          
          {/* Income and Expense Totals with Arrow Symbols */}
          <div className="flex flex-col sm:flex-row justify-start mt-4 space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-12">
            {/* Income with Up Arrow */}
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs md:text-sm text-gray-500">Income</p>
                <p className="text-base md:text-lg font-medium text-green-600">₹{incomeTotal.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Expense with Down Arrow */}
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs md:text-sm text-gray-500">Expense</p>
                <p className="text-base md:text-lg font-medium text-red-600">₹{expenseTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Financial Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/addIncome')}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Add Income
          </button>
          <button
            onClick={() => navigate('/addExpense')}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm md:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Filter buttons  */}
      <div className="mb-4 sm:mb-6 overflow-x-auto">
        <div className="flex space-x-2 md:space-x-4 min-w-max">
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
      </div>

      {/* Display expenses list */}
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {activeFilter !== 'all' ? `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Expenses (${filteredExpenses.length})` : 'All Expenses'}
        </h2>

        {loading && <p className="text-center py-4">Loading expenses...</p>}

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {!loading && !error && filteredExpenses.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No expenses found for the selected period.
          </p>
        )}

        {!loading && !error && filteredExpenses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left text-xs sm:px-4 sm:text-sm">Date</th>
                  <th className="px-2 py-2 text-left text-xs sm:px-4 sm:text-sm">Description</th>
                  <th className="px-2 py-2 text-left text-xs sm:px-4 sm:text-sm">Category</th>
                  <th className="px-2 py-2 text-right text-xs sm:px-4 sm:text-sm">Amount</th>
                  <th className="px-2 py-2 text-center text-xs sm:px-4 sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-b">
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{formatDate(expense.date)}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{expense.description}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{expense.category}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm font-medium text-red-600">
                      -₹{parseFloat(expense.amount).toFixed(2)}
                    </td>

                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-center flex justify-center space-x-2 text-xs sm:text-sm">
                      {expense.receiptImage && (
                        <button
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setSelectedImage(`http://localhost:3000/${expense.receiptImage}`);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showModal && selectedImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out px-4"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-100 hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                  <img
                    src={selectedImage}
                    alt="Receipt"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;