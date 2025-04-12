import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import { CATEGORIES } from '../../constants/categories';

const AddTransactionModal = () => {
  const { 
    showAddModal, 
    setShowAddModal, 
    transactionType, 
    formData, 
    handleInputChange, 
    handleSubmit 
  } = useTransactions();

  // State for income-specific fields
  const [incomeDetails, setIncomeDetails] = useState({
    income: '',
    emi: 0,
    rent: 0,
    investment: 0,
    others: 0
  });

  // Calculate balance for income
  const calculateIncomeBalance = () => {
    const { income, emi, rent, investment, others } = incomeDetails;
    const totalIncome = parseFloat(income || 0);
    const totalReductions = 
      parseFloat(emi || 0) + 
      parseFloat(rent || 0) + 
      parseFloat(investment || 0) + 
      parseFloat(others || 0);
    
    // Ensure we return a number
    const balance = Math.max(totalIncome - totalReductions, 0);
    return isNaN(balance) ? 0 : balance;
  };

  // Handle input changes for income details
  const handleIncomeDetailsChange = (e) => {
    const { name, value } = e.target;
    setIncomeDetails(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  // Modify form submission to handle income details
  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    
    // Ensure income is a valid number
    const incomeValue = parseFloat(incomeDetails.income);
    if (isNaN(incomeValue) || incomeValue <= 0) {
      alert('Please enter a valid income amount');
      return;
    }
    
    // Prepare transaction data
    const transactionData = {
      id: Date.now(), // Use timestamp as unique ID
      date: formData.date,
      amount: calculateIncomeBalance(),
      description: `Income (after deductions)`,
      type: 'income',
      category: 'Salary' // Default income category
    };

    // Additional metadata for income breakdown
    const incomeBreakdown = {
      totalIncome: incomeDetails.income,
      emi: incomeDetails.emi,
      rent: incomeDetails.rent,
      investment: incomeDetails.investment,
      others: incomeDetails.others
    };

    // Call submit with transaction data and income breakdown
    handleSubmit(e, transactionData, incomeBreakdown);
  };

  if (!showAddModal) return null;

  // Render for income
  if (transactionType === 'income') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-1/3 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add Income</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleIncomeSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Income</label>
              <input
                type="number"
                name="income"
                value={incomeDetails.income}
                onChange={handleIncomeDetailsChange}
                placeholder="Enter total income"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">EMI (0 if none)</label>
              <input
                type="number"
                name="emi"
                value={incomeDetails.emi}
                onChange={handleIncomeDetailsChange}
                placeholder="Enter EMI amount"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rent (0 if none)</label>
              <input
                type="number"
                name="rent"
                value={incomeDetails.rent}
                onChange={handleIncomeDetailsChange}
                placeholder="Enter rent amount"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Investment (0 if none)</label>
              <input
                type="number"
                name="investment"
                value={incomeDetails.investment}
                onChange={handleIncomeDetailsChange}
                placeholder="Enter investment amount"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Others (0 if none)</label>
              <input
                type="number"
                name="others"
                value={incomeDetails.others}
                onChange={handleIncomeDetailsChange}
                placeholder="Enter other deductions"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Balance</label>
              <input
                type="number"
                value={calculateIncomeBalance()}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 focus:outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
              >
                Add Income
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Existing expense modal remains the same
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add Expense</h3>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {CATEGORIES.expense.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;