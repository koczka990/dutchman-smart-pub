// Simulate a database using localStorage
const Database = {
    // Load data from localStorage
    load: function (key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },
  
    // Save data to localStorage
    save: function (key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },
  
    // Clear all data (for testing/reset purposes)
    clear: function () {
      localStorage.clear();
    },
  };
  
  export default Database;