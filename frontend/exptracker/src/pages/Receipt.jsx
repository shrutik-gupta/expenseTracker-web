import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

const Receipt = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/expenses');
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading receipts...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Receipts</h1>
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center">No expenses found.</p>
      ) : (
        expenses.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 border rounded-md p-4 shadow-sm bg-white"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
              <FileText className="text-purple-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.category}</h3>
              <p className="text-sm text-black font-medium">{new Date(item.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <p className="text-sm text-gray-800 mt-1 font-semibold">₹{item.amount}</p>
              {item.receiptImage && (
                <img
                  src={`http://localhost:3000/${item.receiptImage}`}
                  alt="Receipt"
                  className="mt-3 max-h-40 rounded border"
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Receipt;
