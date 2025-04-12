import React, { useState, useEffect } from 'react';
import { Bell, Receipt, PieChart, Home, Plus, ShoppingCart, BookOpen, Wine, Search, User, Settings, DollarSign, Building, Briefcase, CreditCard } from 'lucide-react';

const ExpenseTrackerWebsite = () => {
  // State for current view and data
  const [currentView, setCurrentView] = useState('Today');
  const [balance, setBalance] = useState(12560.00);
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Shopping',
    date: new Date().toISOString().substr(0, 10)
  });
  
  // Mock data that would come from your backend
  const [monthlyData, setMonthlyData] = useState({
    exp: 25000,
    bal: 5000,
    inc: 30000,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
  });
  
  // Transaction categories with their icons
  const categories = {
    expense: [
      { id: 'shopping', name: 'Shopping', icon: <ShoppingCart size={20} /> },
      { id: 'education', name: 'Education', icon: <BookOpen size={20} /> },
      { id: 'food', name: 'Food', icon: <Wine size={20} /> },
      { id: 'rent', name: 'Rent', icon: <Building size={20} /> },
      { id: 'emi', name: 'EMI', icon: <CreditCard size={20} /> }
    ],
    income: [
      { id: 'salary', name: 'Salary', icon: <DollarSign size={20} /> },
      { id: 'investment', name: 'Investment', icon: <Briefcase size={20} /> },
      { id: 'other', name: 'Other', icon: <DollarSign size={20} /> }
    ]
  };
  
  // Initial expenses data
  const [expenses, setExpenses] = useState([
    { id: 1, date: '18 Aug', category: 'Shopping', description: 'Clothes and watch', amount: 1101.00, type: 'expense', icon: <ShoppingCart size={20} /> },
    { id: 2, date: '18 Aug', category: 'Shopping', description: 'Clothes and watch', amount: 18025.00, type: 'expense', icon: <ShoppingCart size={20} /> },
    { id: 3, date: '18 Aug', category: 'Education', description: 'Books and Stationary', amount: 5024.00, type: 'expense', icon: <BookOpen size={20} /> },
    { id: 4, date: '18 Aug', category: 'Food', description: 'Kirana and Ration', amount: 11021.00, type: 'expense', icon: <Wine size={20} /> },
    { id: 5, date: '17 Aug', category: 'Shopping', description: 'Clothes and watch', amount: 18025.00, type: 'expense', icon: <ShoppingCart size={20} /> }
  ]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };
  
  // Calculate total income, expenses, and balance
  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    expenses.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });
    
    // Set balance based on income minus expenses
    setBalance(totalIncome - totalExpense);
    
    // Update monthly data
    setMonthlyData(prev => ({
      ...prev,
      inc: totalIncome,
      exp: totalExpense,
      bal: totalIncome - totalExpense
    }));
  }, [expenses]);
  
  // Generate chart bars with varying heights
  const generateBarChart = () => {
    const heights = [60, 40, 70, 30, 50, 45, 80, 60, 40, 55, 35];
    
    return monthlyData.months.map((month, index) => (
      <div key={month} className="flex flex-col items-center">
        <div className="w-6 rounded-full bg-gray-500 opacity-50 mb-2" 
          style={{ height: `${heights[index]}px`, backgroundColor: month === 'Aug' ? '#f4a261' : '' }}>
        </div>
        <span className="text-xs text-white">{month}</span>
      </div>
    ));
  };

  // Handler for view button clicks
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Get icon based on category
  const getCategoryIcon = (categoryName, type) => {
    const categoryList = type === 'income' ? categories.income : categories.expense;
    const category = categoryList.find(cat => cat.name === categoryName);
    return category ? category.icon : <ShoppingCart size={20} />;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new transaction
    const newTransaction = {
      id: expenses.length + 1,
      date: formatDate(formData.date),
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: transactionType,
      icon: getCategoryIcon(formData.category, transactionType)
    };
    
    // Add to expenses list
    setExpenses(prev => [newTransaction, ...prev]);
    
    // Reset form and close modal
    setFormData({
      amount: '',
      description: '',
      category: transactionType === 'expense' ? 'Shopping' : 'Salary',
      date: new Date().toISOString().substr(0, 10)
    });
    
    setShowAddModal(false);
  };
  
  // Open modal with specific transaction type
  const openAddModal = (type) => {
    setTransactionType(type);
    setFormData(prev => ({
      ...prev,
      category: type === 'expense' ? 'Shopping' : 'Salary'
    }));
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-900 text-white px-8 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PieChart size={24} />
            <h1 className="text-xl font-bold">ExpenseTracker</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-purple-800 text-white rounded-full py-1 px-4 pl-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search size={16} className="absolute left-2 top-2 text-purple-300" />
            </div>
            <button className="hover:text-purple-300"><Bell size={20} /></button>
            <button className="hover:text-purple-300"><Settings size={20} /></button>
            <button className="flex items-center space-x-2 hover:text-purple-300">
              <User size={20} />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-4">
                <button className="flex items-center space-x-2 w-full p-2 bg-purple-100 rounded-md text-purple-900 font-medium">
                  <Home size={20} />
                  <span>Dashboard</span>
                </button>
                <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-md text-gray-600">
                  <Receipt size={20} />
                  <span>Transactions</span>
                </button>
                <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-md text-gray-600">
                  <PieChart size={20} />
                  <span>Analytics</span>
                </button>
                <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-md text-gray-600">
                  <Bell size={20} />
                  <span>Reminders</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="col-span-10">
            {/* Balance card */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Balance</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openAddModal('income')}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Income
                  </button>
                  <button 
                    onClick={() => openAddModal('expense')}
                    className="bg-purple-100 text-purple-900 hover:bg-purple-200 px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Expense
                  </button>
                  <button className="bg-purple-900 text-white hover:bg-purple-800 px-4 py-2 rounded-lg">
                    Export
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-5xl font-bold ${balance >= 0 ? 'text-purple-900' : 'text-red-600'} mb-2`}>
                    ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-gray-500">Available Balance</p>
                </div>
                
                <div className="bg-purple-900 rounded-lg p-6 text-white w-1/2">
                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <p className="text-orange-300">Expenses</p>
                      <p className="text-xl">₹{monthlyData.exp.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white">August</p>
                    </div>
                    <div className="text-center">
                      <p className="text-orange-300">Income</p>
                      <p className="text-xl">₹{monthlyData.inc.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mb-2">
                    {generateBarChart()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expenses list */}
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
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-4">{expense.date}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className={`${expense.type === 'income' ? 'bg-green-200' : 'bg-purple-200'} p-2 rounded-full mr-3`}>
                              {expense.icon}
                            </div>
                            <span>{expense.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{expense.description}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${expense.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {expense.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-right font-medium ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-500 text-sm">Showing {expenses.length} of {expenses.length} transactions</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Previous</button>
                  <button className="px-3 py-1 rounded bg-purple-200 text-purple-900">1</button>
                  <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">2</button>
                  <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">3</button>
                  <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
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
      
      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
              </h3>
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
                  {transactionType === 'expense' ? 
                    categories.expense.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    )) :
                    categories.income.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))
                  }
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
                  className={`px-4 py-2 rounded text-white ${
                    transactionType === 'expense' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Add {transactionType === 'expense' ? 'Expense' : 'Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTrackerWebsite;