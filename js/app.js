import MenuController from "./controllers/menuController.js";
import StorageController from "./controllers/storageController.js";
import LoginController from "./controllers/loginController.js";
import LanguageSwitcher from "./utils/languageSwitcher.js";
import Constructor from "./views/constructor.js";

class App {
  constructor() {
    this.loginController = new LoginController(this);
    this.menuController = new MenuController(this);
    this.storageController = new StorageController(this);
    this.languageSwitcher = new LanguageSwitcher();
    this.constructor = new Constructor();
    this.currentView = null;

    this.init();

    // Load the default view
    this.loadView("login");
  }

  // Initialize the index page
  init() {
    this.loadContent();
    this.setupEventListeners();
  }

  // Load the dynamic content of the index page.
  // Also used when reloading.
  // Don't forget to empty the content before loading new content
  loadContent() {
    $(document).ready(() => {
      $("#menuBtn").text(this.trans("Menu"));
      $("#storageBtn").text(this.trans("Storage"));

      // Populate language switcher options
      const languageList = this.languageSwitcher.getLanguageList();
      const currentLanguage = this.languageSwitcher.getCurrentLanguage();
      const languageSwitcher = $("#languageSwitcher");
      languageSwitcher.empty();
      languageList.forEach((lang) => {
        languageSwitcher.append(this.constructor.createSelectOption(lang, this.trans(lang), lang === currentLanguage));
      });
    });
  }

  setupEventListeners() {
    $(document).ready(() => {
      $("#menuBtn").on("click", () => this.loadView("menu"));
      $("#storageBtn").on("click", () => this.loadView("storage"));
      $("#languageSwitcher").on("change", (event) => {
        const selectedLanguage = event.target.value;
        this.languageSwitcher.setLanguage(selectedLanguage);

        this.loadContent();
        this.loadView(this.currentView);
      })
    });
  }

  // Load the specified view
  loadView(view) {
    this.currentView = view;
    console.log("Switching to view:", view);
    switch (view) {
      case "login":
        this.loginController.render();
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

  trans(key) {
    return this.languageSwitcher.translate(key);
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
