import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#AA66CC'];

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/expenses');
        const data = await response.json();
        setExpenses(data);
        setFilteredExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, expenses]);

  const applyFilter = () => {
    const now = new Date();

    if (filter === 'All') {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const diffInDays = (now - expenseDate) / (1000 * 60 * 60 * 24);

        if (filter === 'Daily') return diffInDays < 1;
        if (filter === 'Weekly') return diffInDays <= 7;
        if (filter === 'Monthly') return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();

        return true;
      });
      setFilteredExpenses(filtered);
    }
  };

  // Group by category
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount
  }));

  const getFilterButtonClass = (buttonType) => {
    return `px-2 py-2 sm:px-4 text-sm sm:text-base rounded-lg ${
      filter === buttonType 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    } transition-colors duration-200 cursor-pointer flex-1 text-center`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {['All', 'Daily', 'Weekly', 'Monthly'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={getFilterButtonClass(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        {/* Bar Chart */}
        <div className="w-full lg:w-1/2">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Expense by Category</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="w-full lg:w-1/2">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Expense Distribution</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={chartData.length > 0 ? "70%" : 80}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {chartData.length === 0 && (
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No expense data available for the selected period.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;