import Database from "./database.js";

class UserModel {
  constructor() {
    this.users = [];
  }

  async loadUsers() {
    try {
      const response = await fetch("/data/users.json");
      this.users = await response.json();
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  authenticate(username, password) {
    console.log("authenticating from user model");
    return this.users.find(
      (user) => user.username === username && user.password === password
    );
  }

  // // Load users from the database
  // loadUsers() {
  //   return Database.load("users") || [];
  // }

  // Save users to the database
  saveUsers(users) {
    Database.save("users", users);
  }

  // // Authenticate a user (for login)
  // authenticate(username, password) {
  //   const users = this.loadUsers();
  //   return users.find(
  //     (user) => user.username === username && user.password === password
  //   );
  // }

  // Add a new user
  addUser(user) {
    const users = this.loadUsers();
    users.push(user);
    this.saveUsers(users);
  }

  // Update user balance (for VIP users)
  updateBalance(username, amount) {
    const users = this.loadUsers();
    const user = users.find((user) => user.username === username);
    if (user) {
      user.balance += amount;
      this.saveUsers(users);
    }
  }

  // Remove a user
  removeUser(username) {
    let users = this.loadUsers();
    users = users.filter((user) => user.username !== username);
    this.saveUsers(users);
  }
}

export default UserModel;
