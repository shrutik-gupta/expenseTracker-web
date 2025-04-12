import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const TransactionItem = ({ transaction }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4">{transaction.date}</td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className={`${transaction.type === 'income' ? 'bg-green-200' : 'bg-purple-200'} p-2 rounded-full mr-3`}>
            {transaction.icon}
          </div>
          <span>{transaction.category}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-gray-500">{transaction.description}</td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {transaction.type === 'income' ? 'Income' : 'Expense'}
        </span>
      </td>
      <td className={`px-4 py-4 text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.type === 'income' ? '+' : '-'}₹{formatCurrency(transaction.amount)}
      </td>
    </tr>
  );
};

export default TransactionItem;