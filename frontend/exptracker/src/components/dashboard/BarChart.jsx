import React from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import { formatCurrency } from '../../utils/formatters';

const BarChart = () => {
  const { monthlyData } = useTransactions();

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

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-purple-900 rounded-lg p-6 text-white w-full">
      <div className="text-2xl font-bold ">
          <p className="text-white">{currentMonth}</p>
        </div>
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <p className="text-orange-300">Expenses</p>
          <p className="text-xl">₹{formatCurrency(monthlyData.exp)}</p>
        </div>
        <div className="text-center">
          <p className="text-orange-300">Balance</p>
          <p className="text-xl">₹{formatCurrency(monthlyData.inc - monthlyData.exp)}</p>
        </div>
        <div className="text-center">
          <p className="text-orange-300">Income</p>
          <p className="text-xl">₹{formatCurrency(monthlyData.inc)}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-2">
        {generateBarChart()}
      </div>
    </div>
  );
};

export default BarChart;