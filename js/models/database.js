// Simulate a database using localStorage
class Database {
  // Load data from localStorage
  load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Save data to localStorage
  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Clear all data (for testing/reset purposes)
  clear() {
    localStorage.clear();
  }
}

export default Database;
