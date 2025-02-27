import MenuController from "./controllers/menuController.js";
import StorageController from "./controllers/storageController.js";
import LoginController from "./controllers/loginController.js";

class App {
  constructor() {
    this.loginController = new LoginController(this);
    this.menuController = new MenuController(this);
    this.storageController = new StorageController(this);

    this.init();
  }

  init() {
    console.log("App initialized");
    this.setupEventListeners();
    this.loadView("login");
  }

  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      document
        .getElementById("menuBtn")
        .addEventListener("click", () => this.loadView("menu"));
      document
        .getElementById("storageBtn")
        .addEventListener("click", () => this.loadView("storage"));
    });
  }

  loadView(view) {
    console.log("Switching to view:", view);
    switch (view) {
      case "login":
        this.loginController.render(this.loginController);
        break;
      case "menu":
        this.menuController.render();
        break;
      case "storage":
        this.storageController.render();
        break;
      default:
        console.error("View not found:", view);
    }
  }
}

const app = new App();

export default app;

// import Database from "./models/database.js";
// import MenuModel from "./models/menuModel.js";
// import UserModel from "./models/userModel.js";

// // Initialize sample data if the database is empty
// if (!Database.load("menuItems")) {
//   const sampleMenuItems = [
//     {
//       id: 1,
//       name: "IPA Beer",
//       type: "Beer",
//       producer: "Brewery X",
//       country: "USA",
//       strength: "5.5%",
//       servingSize: "500ml",
//       price: 5.99,
//       stock: 10,
//     },
//     {
//       id: 2,
//       name: "Cheese Platter",
//       type: "Food",
//       ingredients: ["Cheese", "Crackers", "Grapes"],
//       price: 12.99,
//       stock: 5,
//     },
//   ];
//   MenuModel.saveMenuItems(sampleMenuItems);
// }

// if (!Database.load("users")) {
//   const sampleUsers = [
//     {
//       id: 1,
//       username: "vip_user",
//       password: "vip123",
//       role: "VIP",
//       balance: 100.0,
//     },
//     {
//       id: 2,
//       username: "bartender",
//       password: "bar123",
//       role: "Bartender",
//     },
//   ];
//   UserModel.saveUsers(sampleUsers);
// }

// console.log("Database initialized.");

// $(document).ready(function() {
//     // Initialize the login page
//     console.log("Login Page Loaded");
// });
