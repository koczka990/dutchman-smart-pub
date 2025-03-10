// Simulate a database using localStorage
class Database {
  constructor() {
    // Initialize data in localStorage if it doesn't exist
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
  }

  // Load data from localStorage
  load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return null;
    }
  }

  // Save data to localStorage
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Successfully saved ${key} to localStorage`);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      throw error;
    }
  }

  // Update existing data in LocalStorage
  updateData(key, data) {
    console.log("Updating data for key:", key);
    this.save(key, data);
  }

  // Clear all data (for testing/reset purposes)
  clear() {
    console.log("Clearing all data from localStorage");
    localStorage.clear();
  }
}

export default Database;
