class UserModel {
  constructor(database) {
    this.database = database;

    this.users = [];

    this.sessionId = this.getSessionId();
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem("current_session_id");
    if (!sessionId) {
      // Generate a new session ID if none exists
      sessionId = "session_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("current_session_id", sessionId);
    }
    return sessionId;
  }

  async loadUsers() {
    if (this.users.length > 0) {
      return this.users;
    }

    try {
      console.log("Loading users");
      // Load users from localStorage using Database class
      const response = await fetch("data/users.json");
      this.users = await response.json();
      console.log("this.users:", this.users);
      return this.users;
    } catch (error) {
      console.error("Error loading users:", error);
      throw error;
    }
  }

  authenticate(username, password) {
    console.log("authenticating from user model");
    return this.users.find(
      (user) => user.username.toLowerCase() === username && user.password.toLowerCase() === password
    );
  }

  // Store user session data
  storeUserSession(userData) {
    const sessionKey = `${this.sessionId}_user`;
    console.log("Storing user session data:", { sessionKey, userData });
    sessionStorage.setItem(sessionKey, JSON.stringify(userData));
  }

  getUserData() {
    const sessionKey = `${this.sessionId}_user`;
    const userData = sessionStorage.getItem(sessionKey);
    return userData;
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
