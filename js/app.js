// Controllers
import MenuController from "./controllers/menuController.js";
import StorageController from "./controllers/storageController.js";
import LoginController from "./controllers/loginController.js";
import PaymentController from "./controllers/paymentController.js";
import OrderController from "./controllers/orderController.js";

// Database
import Database from "./models/database.js";

// Utils
import LanguageSwitcher from "./utils/languageSwitcher.js";
import Constructor from "./views/constructor.js";

class App {
  constructor() {
    this.database = new Database();
    this.loginController = new LoginController(this);
    this.menuController = new MenuController(this);
    this.storageController = new StorageController(this);
    this.paymentController = new PaymentController(this);
    this.orderController = new OrderController(this);
    this.languageSwitcher = new LanguageSwitcher();
    this.constructor = new Constructor();

    this.init();

    // Load the default view
    this.loadView("login");
  }

  // Initialize the index page
  init() {
    this.loadContent();
    this.setupEventListeners();
    this.toggleMenuVisibility();
  }

  // Load the dynamic content of the index page.
  // Also used when reloading.
  // Don't forget to empty the content before loading new content
  loadContent() {
    // Populate language switcher options
    const languageList = this.languageSwitcher.getLanguageList();
    const currentLanguage = this.languageSwitcher.getCurrentLanguage();
    const languageSwitcher = $("#languageSwitcher");
    languageSwitcher.empty();
    languageList.forEach((lang) => {
      languageSwitcher.append(
        this.constructor.createSelectOption(
          lang,
          lang,
          lang === currentLanguage,
          "",
          "",
          "lan-" + lang
        )
      );
    });
  }

  setupEventListeners() {
    $(document).ready(() => {
      $("#menuBtn").on("click", () => this.loadView("menu"));
      $("#storageBtn").on("click", () => this.loadView("storage"));
      $("#orderBtn").on("click", () => this.loadView("order"));
      $("#logoutBtn").on("click", () => {
        this.loginController.model.clearUserSession("order");
        this.loadView("login");
      });
      $("#languageSwitcher").on("change", (event) => {
        const selectedLanguage = event.target.value;
        this.languageSwitcher.setLanguage(selectedLanguage);
        this.languageSwitcher.translateHTML();
      });
    });
  }

  // Load the specified view
  loadView(view) {
    console.log("Switching to view:", view);
    let renderPromise;
    switch (view) {
      case "login":
        renderPromise = this.loginController.render();
        break;
      case "menu":
        renderPromise = this.menuController.render();
        break;
      case "storage":
        renderPromise = this.storageController.render();
        break;
      case "payment":
        renderPromise = this.paymentController.render();
        break;
      case "order":
        renderPromise = this.orderController.render();
        break;
      default:
        console.error("View not found:", view);
        return;
    }

    // Translate the HTML content after rendering
    renderPromise.then(() => {
      this.languageSwitcher.translateHTML();
      this.toggleMenuVisibility();
    });
  }

  toggleMenuVisibility() {
    const sessionData = this.loginController.model.getUserData();

    console.log("Checking session data:", sessionData);
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      console.log("User data:", userData);

      if (userData.isVIP === true) {
        // VIP user is logged in, hide menu
        $("#menuBtn").hide();
        $("#storageBtn").hide();
        $("#orderBtn").hide();
      } else {
        // Non-VIP user is logged in, show menu
        $("#menuBtn").show();
        $("#storageBtn").show();
        $("#orderBtn").show();
      }
    } else {
      // No session, hide menu
      $("#menuBtn").hide();
      $("#storageBtn").hide();
      $("#orderBtn").hide();
    }
  }
}

const app = new App();

export default app;
