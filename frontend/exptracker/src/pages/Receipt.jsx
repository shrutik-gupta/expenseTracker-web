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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="text-purple-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-800">Receipts</h1>
      </div>
      
      {expenses.filter((item) => item.receiptImage).length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-500 text-lg">No receipts found</p>
          <p className="text-gray-400">Upload receipts to see them here</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {expenses
            .filter((item) => item.receiptImage)
            .map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="sm:w-1/3 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={`http://localhost:3000/${item.receiptImage}`}
                    alt="Receipt"
                    className="max-h-60 w-full object-contain rounded"
                  />
                </div>
                <div className="sm:w-2/3 p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">
                      <FileText className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.category}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-700">{item.description}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-lg font-bold text-purple-600">₹{item.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Receipt;