import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceCard from '../components/dashboard/BalanceCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);


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

      // Remove the deleted expense from state
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      setError('Failed to delete expense. ' + err.message);
    }
  };


  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center w-full px-6 mb-6">
        <BalanceCard />
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
        {/* <div className="flex space-x-3">
          <button
            onClick={() => navigate('/addIncome')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Income
          </button>
          <button
            onClick={() => navigate('/addExpense')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Expense
          </button>
        </div> */}
      </div>

      {/* Display expenses list */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

        {loading && <p className="text-center py-4">Loading expenses...</p>}

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {!loading && !error && expenses.length === 0 && (
          <p className="text-gray-500 text-center py-4">No expenses found. Add your first expense!</p>
        )}

        {!loading && !error && expenses.length > 0 && (
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
                {expenses.map((expense) => (
                  <tr key={expense._id} className="border-b">
                    <td className="px-4 py-3">{formatDate(expense.date)}</td>
                    <td className="px-4 py-3">{expense.description}</td>
                    <td className="px-4 py-3">{expense.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">
                      -${parseFloat(expense.amount).toFixed(2)}
                    </td>
                    
                    <td className="px-4 py-3 text-center space-x-2">
                      {expense.receiptImage && (
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => window.open(`http://localhost:3000/${expense.receiptImage}`, '_blank')}
                        >
                          View
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;