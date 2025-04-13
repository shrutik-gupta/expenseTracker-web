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
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    // Filter expenses based on search term
    if (searchTerm.trim() === '') {
      setFilteredExpenses(expenses);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = expenses.filter(expense => 
        expense.description?.toLowerCase().includes(lowercaseSearch) ||
        expense.category?.toLowerCase().includes(lowercaseSearch) ||
        expense.amount?.toString().includes(lowercaseSearch) ||
        (expense.date && new Date(expense.date).toLocaleDateString().includes(lowercaseSearch))
      );
      setFilteredExpenses(filtered);
    }
  }, [searchTerm, expenses]);

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
      
      // No need to manually update the expense total here as it will be updated by the useEffect
    } catch (err) {
      setError('Failed to delete expense. ' + err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center w-full px-6 mb-6">
        <div className="w-full mb-4 text-center">
          <h2 className="text-3xl font-semibold text-green-700">
            Balance: ₹{(incomeTotal - expenseTotal).toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/addIncome')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Add Income
          </button>
          <button
            onClick={() => navigate('/addExpense')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search expenses by description, category, amount..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Display expenses list */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">
          {searchTerm ? `Search Results (${filteredExpenses.length})` : 'Recent Expenses'}
        </h2>

        {loading && <p className="text-center py-4">Loading expenses...</p>}

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {!loading && !error && filteredExpenses.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            {searchTerm ? `No expenses found matching "${searchTerm}"` : 'No expenses found. Add your first expense!'}
          </p>
        )}

        {!loading && !error && filteredExpenses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-b">
                    <td className="px-4 py-3">{formatDate(expense.date)}</td>
                    <td className="px-4 py-3">{expense.description}</td>
                    <td className="px-4 py-3">{expense.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">
                      -₹{parseFloat(expense.amount).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-center space-x-2">
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
                className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-100 hover:scale-105"
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