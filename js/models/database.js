// Simulate a database using localStorage
class Database {
  constructor() {
    console.log("Initializing Database");
    // Initialize data in localStorage if it doesn't exist
    if (!localStorage.getItem('users')) {
      // Load users from data/users.json instead of empty array
      fetch('/data/users.json')
        .then(response => response.json())
        .then(users => {
          localStorage.setItem('users', JSON.stringify(users));
          console.log('Users initialized from data/users.json');
        })
        .catch(error => {
          console.error('Error loading users from data/users.json:', error);
          // Fallback to empty array if file can't be loaded
          localStorage.setItem('users', JSON.stringify([]));
        });
    }
    if (!localStorage.getItem("orders")) {
      localStorage.setItem("orders", JSON.stringify([]));
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
