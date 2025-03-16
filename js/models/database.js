// Simulate a database using localStorage
class Database {
  constructor() {
    this.init();
  }

  init() {
    console.log("Initializing Database");

    this.initializeData("users", "/data/users.json");
    this.initializeData("orders", null);
  }

  // Helper function to initialize data in localStorage
  async initializeData(key, fallbackDataUrl) {
    try {
      if (!localStorage.getItem(key)) {
        if (fallbackDataUrl) {
          const response = await fetch(fallbackDataUrl);
          const data = await response.json();
          localStorage.setItem(key, JSON.stringify(data));
          console.log(`${key} initialized from ${fallbackDataUrl}`);
        } else {
          // If no URL is provided, initialize with empty array
          localStorage.setItem(key, JSON.stringify([]));
          console.log(`${key} initialized with empty array.`);
        }
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      // Optionally show user-friendly error message or fallback
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
        console.log(`${key} initialized with empty array due to error.`);
      }
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
