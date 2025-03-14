// Controllers
import MenuController from "./controllers/menuController.js";
import StorageController from "./controllers/storageController.js";
import LoginController from "./controllers/loginController.js";
import PaymentController from "./controllers/paymentController.js";

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
        this.paymentController.render();
        break;
      default:
        console.error("View not found:", view);
        return;
    }

    // Translate the HTML content after rendering
    renderPromise.then(() => {
      this.languageSwitcher.translateHTML();
    });
  }
}

const app = new App();

export default app;
