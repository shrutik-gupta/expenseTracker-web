import React, { createContext, useState, useContext, useEffect } from 'react';
import { formatDate, getCurrentDateString } from '../utils/formatters';
import { getCategoryIcon, CATEGORIES } from '../constants/categories';

const initialTransactions = [];

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalance] = useState(12560.00);
  const [monthlyData, setMonthlyData] = useState({
    exp: 25000,
    bal: 5000,
    inc: 30000,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
  });
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Shopping',
    date: getCurrentDateString()
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  
  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });
    
    setBalance(totalIncome - totalExpense);
    
    setMonthlyData(prev => ({
      ...prev,
      inc: totalIncome,
      exp: totalExpense,
      bal: totalIncome - totalExpense
    }));
  }, [transactions]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Updated handleSubmit to handle both income and expense
  const handleSubmit = (e, transactionData = null, incomeBreakdown = null) => {
    e.preventDefault();
    
    // If transactionData is passed (from income submission), use it
    const finalTransactionData = transactionData || {
      id: transactions.length + 1,
      date: formatDate(formData.date),
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: transactionType,
      icon: getCategoryIcon(formData.category, transactionType)
    };

    // Ensure amount is a valid number
    if (isNaN(finalTransactionData.amount)) {
      console.error('Invalid amount:', finalTransactionData.amount);
      return;
    }
    
    // Add additional metadata for income if available
    if (incomeBreakdown) {
      finalTransactionData.incomeBreakdown = incomeBreakdown;
    }
    
    // Add to transactions list
    setTransactions(prev => [finalTransactionData, ...prev]);
    
    // Reset form and close modal
    setFormData({
      amount: '',
      description: '',
      category: transactionType === 'expense' ? 'Shopping' : 'Salary',
      date: getCurrentDateString()
    });
    
    setShowAddModal(false);
  };
  
  const openAddModal = (type) => {
    setTransactionType(type);
    setFormData(prev => ({
      ...prev,
      category: type === 'expense' ? 'Shopping' : 'Salary'
    }));
    setShowAddModal(true);
  };
  
  const value = {
    transactions,
    balance,
    monthlyData,
    formData,
    showAddModal,
    transactionType,
    handleInputChange,
    handleSubmit,
    openAddModal,
    setShowAddModal
  };
  
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};