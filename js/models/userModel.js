import Database from "./database.js";

class UserModel {
  constructor() {
    this.users = [];
    this.database = new Database();
    // Get existing session ID or create a new one
    this.sessionId =
      sessionStorage.getItem("current_session_id") || this.generateSessionId();
    // Store the session ID if it's new
    if (!sessionStorage.getItem("current_session_id")) {
      sessionStorage.setItem("current_session_id", this.sessionId);
    }
    console.log("Using session ID:", this.sessionId);
  }

  generateSessionId() {
    return "session_" + Math.random().toString(36).substr(2, 9);
  }

  async loadUsers() {
    try {
      console.log("Loading users from localStorage");
      // Load users from localStorage using Database class
      this.users = this.database.load("users") || [];
      return this.users;
    } catch (error) {
      console.error("Error loading users:", error);
      throw error;
    }
  }

  authenticate(username, password) {
    console.log("authenticating from user model");
    return this.users.find(
      (user) => user.username === username && user.password === password
    );
  }

  // Store user session data
  storeUserSession(userData) {
    const sessionKey = `${this.sessionId}_user`;
    console.log("Storing user session data:", { sessionKey, userData });
    sessionStorage.setItem(sessionKey, JSON.stringify(userData));
  }

  // Get current user information
  getCurrentUserInfo() {
    const sessionKey = `${this.sessionId}_user`;
    const userData = sessionStorage.getItem(sessionKey);
    console.log("Retrieved user session data:", { sessionKey, userData });

    if (!userData) {
      console.log("No user data found in sessionStorage");
      return {
        username: null,
        tableNumber: "-",
        balance: null,
        isVIP: false,
      };
    }

    const parsedData = JSON.parse(userData);
    console.log("Parsed user data:", parsedData);
    return {
      username: parsedData.username || null,
      tableNumber: parsedData.tableNumber || "-",
      balance: parsedData.balance || null,
      isVIP: parsedData.isVIP || false,
    };
  }

  // Clear user session
  clearUserSession() {
    const sessionKey = `${this.sessionId}_user`;
    sessionStorage.removeItem(sessionKey);
    sessionStorage.removeItem("current_session_id");
  }

  // Update user balance (for VIP users)
  async updateBalance(username, amount) {
    try {
      // Load current users
      const users = await this.loadUsers();

      if (!users || !Array.isArray(users)) {
        throw new Error("Failed to load users data");
      }

      // Find and update the user's balance
      const userIndex = users.findIndex((user) => user.username === username);
      if (userIndex !== -1) {
        users[userIndex].balance =
          parseFloat(users[userIndex].balance) + amount;

        // Save updated users using the Database class
        this.database.save("users", users);

        console.log(
          `Updated balance for ${username}: ${users[userIndex].balance}`
        );
      } else {
        throw new Error(`User ${username} not found`);
      }
    } catch (error) {
      console.error("Error updating user balance:", error);
      throw error;
    }
  }
}

export default UserModel;
