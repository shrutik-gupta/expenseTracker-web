import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentDateString } from '../utils/formatters';

const AddIncome = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: getCurrentDateString(),
  });

  const [incomeDetails, setIncomeDetails] = useState({
    income: '',
    emi: 0,
    rent: 0,
    investment: 0,
    others: 0,
  });

  const calculateIncomeBalance = () => {
    const { income, emi, rent, investment, others } = incomeDetails;
    const totalIncome = parseFloat(income || 0);
    const totalReductions = parseFloat(emi || 0) + parseFloat(rent || 0) + parseFloat(investment || 0) + parseFloat(others || 0);
    return Math.max(totalIncome - totalReductions, 0);
  };

  const handleIncomeDetailsChange = (e) => {
    const { name, value } = e.target;
    setIncomeDetails((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();

    const incomeValue = parseFloat(incomeDetails.income);
    if (isNaN(incomeValue) || incomeValue <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    const transactionData = {
      income: incomeDetails.income,
      emi: incomeDetails.emi,
      rent: incomeDetails.rent,
      investment: incomeDetails.investment,
      others: incomeDetails.others,
      date: formData.date,
    };

    try {
      const response = await fetch('http://localhost:3000/api/income/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Income added successfully');
        navigate('/dashboard');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add income. Please try again later.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800">Add Income</h1>
      <form onSubmit={handleIncomeSubmit}>
        {['income', 'emi', 'rent', 'investment', 'others'].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="number"
              name={field}
              value={incomeDetails[field]}
              onChange={handleIncomeDetailsChange}
              placeholder={`Enter ${field}`}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.01"
              required={field === 'income'}
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Balance</label>
          <input
            type="number"
            value={calculateIncomeBalance()}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            Add Income
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIncome;
