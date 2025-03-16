// Import necessary modules
import UserModel from "../models/userModel.js";
import LoginView from "../views/loginView.js";

// Define the LoginController class
class LoginController {
  constructor(app) {
    this.app = app; // Reference to the main application
    this.model = new UserModel(app.database); // Initialize the user model
    this.view = new LoginView(); // Initialize the login view
    this.init(); // Call the init method to load users
  }

  // Initialize the controller by loading users
  async init() {
    await this.model.loadUsers();
  }

  // Render the login view and set up event listeners
  async render() {
    await this.view.render(this);
  }

  // Handle VIP customer login
  handleVIPLogin(event) {
    event.preventDefault();

    // Get input values
    const tableNumber = $("#table-number").val();
    const username = $("#username").val();
    const password = $("#password").val();

    // Authenticate VIP user
    const user = this.model.authenticate(username, password);
    console.log("VIP Login attempt:", { username, user });
    
    if (user) {
      console.log("VIP Login Successful:", user);
      // Store user session data with all necessary VIP information
      const userSessionData = {
        username: user.username,
        tableNumber: tableNumber,
        balance: user.balance,
        role: user.role,
        isVIP: true,
      };
      console.log("Storing VIP session data:", userSessionData);
      this.model.storeUserSession(userSessionData);
      this.redirectToMenu();
    } else {
      alert("Invalid username or password.");
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
    if (user && (user.role === "Bartender" || user.role === "Waiter")) {
      console.log("Employee Login Successful:", user);
      // Store user session data
      this.model.storeUserSession({
        username: user.username,
        role: user.role,
      });
      
      // Show regular customer login form
      this.view.showRegularCustomerLogin();
    } else {
      alert("Invalid username or password or not an employee.");
    }
  }

  // Handle regular customer login (only accessible after employee login)
  handleRegularCustomerLogin(event) {
    event.preventDefault();

    // Get input values
    const tableNumber = $("#regular-table-number").val();

    // Store user session data
    const userSessionData = {
      tableNumber: tableNumber,
      isVIP: false,
    };
    console.log("Storing regular customer session data:", userSessionData);
    this.model.storeUserSession(userSessionData);
    this.redirectToMenu();
  }

  // Redirect to the menu view
  redirectToMenu() {
    this.app.toggleMenuVisibility();
    this.app.loadView("menu");
  }
}

// Export the LoginController class
export default LoginController;
