import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './contexts/TransactionContext';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import './App.css';

function App() {
  return (
    <TransactionProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addIncome" element={<AddIncome />} />
              <Route path="/addExpense" element={<AddExpense />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </TransactionProvider>
  );
}

export default App;