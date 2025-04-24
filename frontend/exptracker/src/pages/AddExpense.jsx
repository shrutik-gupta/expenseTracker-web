import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import { getCurrentDateString } from '../utils/formatters';

const AddExpense = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Shopping',
    date: getCurrentDateString(),
  });
  const [receiptImage, setReceiptImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setReceiptImage(null);
    setImagePreview('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('amount', formData.amount);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('date', formData.date);
    if (receiptImage) {
      formDataToSend.append('receiptImage', receiptImage);
    }

    try {
      const response = await fetch('http://localhost:3000/api/expenses/add', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert('Expense added successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Check console for details.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <button
      onClick={() => navigate('/dashboard')}
      className="mb-4 text-purple-600 hover:text-purple-800 font-medium flex items-center cursor-pointer"
    >
      ← Back to Dashboard
    </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Expense</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Enter amount" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500" required min="0.01" step="0.01" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category</label>
          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500" required>
            {CATEGORIES.expense.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Receipt Image (Optional)</label>
          <div className="flex items-center space-x-3">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="receipt-upload" />
            <label htmlFor="receipt-upload" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300">Choose File</label>
            {receiptImage && (
              <button type="button" onClick={handleRemoveImage} className="px-3 py-2 text-red-600 hover:text-red-800">Remove</button>
            )}
          </div>
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Receipt Preview:</p>
              <div className="border rounded-lg p-2">
                <img src={imagePreview} alt="Receipt preview" className="max-h-48 mx-auto" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Filename: {receiptImage.name}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">Cancel</button>
          <button type="submit" className="px-6 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 cursor-pointer">Add Expense</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;