import React from 'react';
import { ShoppingCart, BookOpen, Wine, Building, CreditCard, DollarSign, Briefcase } from 'lucide-react';

// Transaction categories with their icons
export const CATEGORIES = {
  expense: [
    { id: 'shopping', name: 'Shopping', icon: <ShoppingCart size={20} /> },
    { id: 'bill&utility', name: 'Bill & Utility', icon: <BookOpen size={20} /> },
    { id: 'food', name: 'Food', icon: <Wine size={20} /> },
    { id: 'others', name: 'Others', icon: <Building size={20} /> }
  ],
  income: [
    { id: 'salary', name: 'Salary', icon: <DollarSign size={20} /> },
    { id: 'investment', name: 'Investment', icon: <Briefcase size={20} /> },
    { id: 'other', name: 'Other', icon: <DollarSign size={20} /> }
  ]
};

// Get icon based on category
export const getCategoryIcon = (categoryName, type) => {
  const categoryList = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
  const category = categoryList.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  return category ? category.icon : <ShoppingCart size={20} />;
};