// Import necessary modules
import UserModel from "../models/userModel.js";
import LoginView from "../views/loginView.js";

// Define the LoginController class
class LoginController {
  constructor(app) {
    this.app = app; // Reference to the main application
    this.model = new UserModel(); // Initialize the user model
    this.view = new LoginView(); // Initialize the login view
    this.init(); // Call the init method to load users
  }

  // Initialize the controller by loading users
  async init() {
    await this.model.loadUsers();
  }

  // Render the login view and set up event listeners
  render() {
    this.view.render(this);
    this.view.setupEventListeners();
    this.view.bindCustomerLogin(this.handleCustomerLogin.bind(this));
    this.view.bindEmployeeLogin(this.handleEmployeeLogin.bind(this));
  }

  // Handle customer login
  handleCustomerLogin(event) {
    event.preventDefault();

    // Get input values
    const tableNumber = $("#table-number").val();
    const isVIP = $("#vip-toggle").is(":checked");
    const username = $("#username").val();
    const password = $("#password").val();

    if (isVIP) {
      // Authenticate VIP user
      const user = this.model.authenticate(username, password);
      if (user) {
        console.log("VIP Login Successful:", user);
        // Save user info to localStorage
        localStorage.setItem("tableNumber", tableNumber);
        localStorage.setItem("username", user.username);
        localStorage.setItem("balance", user.balance);
        this.redirectToMenu();
      } else {
        alert("Invalid username or password.");
      }
    } else {
      // Handle regular customer login
      console.log("Customer Login:", { tableNumber });
      // Save table number to localStorage
      localStorage.setItem("tableNumber", tableNumber);
      localStorage.removeItem("username"); // Clear VIP info
      localStorage.removeItem("balance");
      this.redirectToMenu();
    }
  }

  // Handle employee login
  handleEmployeeLogin(event) {
    event.preventDefault();

    // Get input values
    const username = $("#employee-username").val();
    const password = $("#employee-password").val();

    // Authenticate employee user
    const user = this.model.authenticate(username, password);
    if (user) {
      console.log("Employee Login Successful:", user);
      localStorage.setItem("username", user.username);
      localStorage.removeItem("tableNumber"); // Clear customer info
      localStorage.removeItem("balance");
      this.redirectToMenu();
    } else {
      alert("Invalid username or password.");
    }
  }

  // Redirect to the menu view
  redirectToMenu() {
    this.app.loadView("menu");
  }
}

// Export the LoginController class
export default LoginController;
