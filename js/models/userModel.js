import Database from "./database.js";

const UserModel = {
  // Load users from the database
  loadUsers: function () {
    return Database.load("users") || [];
  },

  // Save users to the database
  saveUsers: function (users) {
    Database.save("users", users);
  },

  // Authenticate a user (for login)
  authenticate: function (username, password) {
    const users = this.loadUsers();
    return users.find(
      (user) => user.username === username && user.password === password
    );
  },

  // Add a new user
  addUser: function (user) {
    const users = this.loadUsers();
    users.push(user);
    this.saveUsers(users);
  },

  // Update user balance (for VIP users)
  updateBalance: function (username, amount) {
    const users = this.loadUsers();
    const user = users.find((user) => user.username === username);
    if (user) {
      user.balance += amount;
      this.saveUsers(users);
    }
  },

  // Remove a user
  removeUser: function (username) {
    let users = this.loadUsers();
    users = users.filter((user) => user.username !== username);
    this.saveUsers(users);
  },
};

export default UserModel;