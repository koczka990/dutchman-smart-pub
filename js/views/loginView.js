class LoginView {
  constructor() {}

  async render(controller) {
    const appContent = document.getElementById("app-content");
    try {
      const response = await fetch("js/html/login.html");
      const html = await response.text();
      appContent.innerHTML = html;

      // Call function to enable tab switching
      this.setupEventListeners();

      this.bindVIPLogin(controller.handleVIPLogin.bind(controller));
      this.bindEmployeeLogin(controller.handleEmployeeLogin.bind(controller));
      this.bindRegularCustomerLogin(controller.handleRegularCustomerLogin.bind(controller));
    } catch (error) {
      console.error("Error loading login.html:", error);
    }
  }

  setupEventListeners() {
    // Show Employee Login Form
    $("#employee-link").click((e) => {
      e.preventDefault();
      $("#vip-login-form").addClass("hidden");
      $("#employee-login-form").removeClass("hidden");
    });

    // Show VIP Login Form
    $("#vip-link").click((e) => {
      e.preventDefault();
      $("#employee-login-form").addClass("hidden");
      $("#regular-customer-login-form").addClass("hidden");
      $("#vip-login-form").removeClass("hidden");
    });

    // Show Regular Customer Login Form (only after employee login)
    $("#back-to-employee").click((e) => {
      e.preventDefault();
      $("#regular-customer-login-form").addClass("hidden");
      // Here we would typically show an employee dashboard
      // For now, we'll just show the employee login form again
      $("#employee-login-form").removeClass("hidden");
    });

    // Validate VIP Login Form
    $("#table-number, #username, #password").on("input", () => {
      validateVIPLoginForm();
    });

    function validateVIPLoginForm() {
      const tableNumber = $("#table-number").val();
      const username = $("#username").val();
      const password = $("#password").val();

      if (tableNumber && username && password) {
        $("#vip-login-submit").prop("disabled", false);
      } else {
        $("#vip-login-submit").prop("disabled", true);
      }
    }

    // Validate Employee Login Form
    $("#employee-username, #employee-password").on("input", () => {
      validateEmployeeLoginForm();
    });

    function validateEmployeeLoginForm() {
      const username = $("#employee-username").val();
      const password = $("#employee-password").val();

      if (username && password) {
        $("#employee-login-submit").prop("disabled", false);
      } else {
        $("#employee-login-submit").prop("disabled", true);
      }
    }

    // Validate Regular Customer Login Form
    $("#regular-table-number").on("input", () => {
      validateRegularCustomerLoginForm();
    });

    function validateRegularCustomerLoginForm() {
      const tableNumber = $("#regular-table-number").val();

      if (tableNumber) {
        $("#regular-customer-login-submit").prop("disabled", false);
      } else {
        $("#regular-customer-login-submit").prop("disabled", true);
      }
    }

    // Initial validation check
    validateVIPLoginForm();
    validateEmployeeLoginForm();
    validateRegularCustomerLoginForm();
  }

  bindVIPLogin(handler) {
    $("#vip-login-form").on("submit", handler);
  }

  bindEmployeeLogin(handler) {
    $("#employee-login-form").on("submit", handler);
  }

  bindRegularCustomerLogin(handler) {
    $("#regular-customer-login-form").on("submit", handler);
  }

  // Method to show regular customer login form after employee login
  showRegularCustomerLogin() {
    $("#employee-login-form").addClass("hidden");
    $("#regular-customer-login-form").removeClass("hidden");
  }
}

export default LoginView;
