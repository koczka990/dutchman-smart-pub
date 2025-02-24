import Database from "./models/database.js";
import MenuModel from "./models/menuModel.js";
import UserModel from "./models/userModel.js";

// Initialize sample data if the database is empty
if (!Database.load("menuItems")) {
  const sampleMenuItems = [
    {
      id: 1,
      name: "IPA Beer",
      type: "Beer",
      producer: "Brewery X",
      country: "USA",
      strength: "5.5%",
      servingSize: "500ml",
      price: 5.99,
      stock: 10,
    },
    {
      id: 2,
      name: "Cheese Platter",
      type: "Food",
      ingredients: ["Cheese", "Crackers", "Grapes"],
      price: 12.99,
      stock: 5,
    },
  ];
  MenuModel.saveMenuItems(sampleMenuItems);
}

if (!Database.load("users")) {
  const sampleUsers = [
    {
      id: 1,
      username: "vip_user",
      password: "vip123",
      role: "VIP",
      balance: 100.0,
    },
    {
      id: 2,
      username: "bartender",
      password: "bar123",
      role: "Bartender",
    },
    {
      id: 3,
      username: "waiter",
      password: "bar123",
      role: "Waiter",
    },
  ];
  UserModel.saveUsers(sampleUsers);
}

console.log("Database initialized.");

$(document).ready(function() {
    // Initialize the login page
    console.log("Login Page Loaded");
});
