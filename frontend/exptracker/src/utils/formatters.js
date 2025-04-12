// Format currency for display
export const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };
  
  // Format date for display (e.g., "18 Aug")
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };
  
  // Get current date in YYYY-MM-DD format for date inputs
  export const getCurrentDateString = () => {
    return new Date().toISOString().substr(0, 10);
  };