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

  return (
    <div style={{ padding: '2rem' }}>
      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['All', 'Daily', 'Weekly', 'Monthly'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: filter === type ? '#007bff' : '#f0f0f0',
              color: filter === type ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {/* Bar Chart */}
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h3>Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h3>Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) =>
                  `${category} ${(percent * 100).toFixed(0)}%`
                }
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
  );
};

export default Analytics;
