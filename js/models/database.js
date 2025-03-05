// Simulate a database using localStorage
class Database {
  constructor() {}

  // Load data from localStorage
  load(key) {
    console.log("Loading data for key:", key);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Save data to localStorage
  save(key, data) {
    console.log("Saving data for key:", key);
    localStorage.setItem(key, JSON.stringify(data));
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
