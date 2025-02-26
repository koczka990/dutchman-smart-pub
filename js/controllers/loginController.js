import UserModel from "../models/userModel.js";
import LoginView from "../views/loginView.js";

class LoginController {
  constructor(app) {
    this.app = app;
    this.model = new UserModel();
    this.view = new LoginView();
    this.init();
  }

  async init() {
    await this.model.loadUsers();
  }

  render() {
    this.view.render();
    this.view.setupEventListeners();
    this.view.bindCustomerLogin(this.handleCustomerLogin.bind(this));
    this.view.bindEmployeeLogin(this.handleEmployeeLogin.bind(this));
  }

  handleCustomerLogin() {
    $("#customer-login-form").submit((event) => {
      event.preventDefault();

      const tableNumber = $("#table-number").val();
      const isVIP = $("#vip-toggle").is(":checked");
      const username = $("#username").val();
      const password = $("#password").val();

      if (isVIP) {
        const user = this.model.authenticate(username, password);
        if (user) {
          console.log("VIP Login Successful:", user);
          // Save user info to localStorage
          localStorage.setItem("tableNumber", tableNumber);
          localStorage.setItem("username", user.username);
          localStorage.setItem("balance", user.balance);
          // window.location.href = "menu.html"; // Redirect to menu page
          this.redirectToMenu();
        } else {
          alert("Invalid username or password.");
        }
      } else {
        console.log("Customer Login:", { tableNumber });
        // Save table number to localStorage
        localStorage.setItem("tableNumber", tableNumber);
        localStorage.removeItem("username"); // Clear VIP info
        localStorage.removeItem("balance");
        // window.location.href = "menu.html"; // Redirect to menu page
        this.redirectToMenu();
      }
    });
  }

  handleEmployeeLogin() {
    $("#employee-login-form").submit((event) => {
      event.preventDefault();

      const username = $("#employee-username").val();
      const password = $("#employee-password").val();

      const user = this.model.authenticate(username, password);
      if (user) {
        console.log("Employee Login Successful:", user);
        localStorage.setItem("username", user.username);
        localStorage.removeItem("tableNumber"); // Clear customer info
        localStorage.removeItem("balance");
        // window.location.href = "menu.html"; // Redirect to menu page
        this.redirectToMenu();
      } else {
        alert("Invalid username or password.");
      }
    });
  }

  redirectToMenu() {
    this.app.loadView("menu");
  }
}

export default LoginController;
