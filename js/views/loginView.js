class LoginView {
  constructor() {
    this.appContent = document.getElementById("app-content");
  }

  async render(controller) {
    try {
      const response = await fetch("js/html/login.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      // Call function to enable tab switching
      this.setupEventListeners();

      this.bindCustomerLogin(controller.handleCustomerLogin.bind(controller));
      this.bindEmployeeLogin(controller.handleEmployeeLogin.bind(controller));
    } catch (error) {
      console.error("Error loading login.html:", error);
    }
  }

  setupEventListeners() {
    // Show Customer Login Form
    $("#customer-login-btn").click(() => {
      $("#customer-login-form").removeClass("hidden");
      $("#employee-login-form").addClass("hidden");
    });

    // Show Employee Login Form
    $("#employee-login-btn").click(() => {
      $("#employee-login-form").removeClass("hidden");
      $("#customer-login-form").addClass("hidden");
    });

    // Toggle VIP Fields
    $("#vip-toggle").change((event) => {
      console.log("VIP Toggle Changed");
      console.log(event.target.checked);
      if (event.target.checked) {
        $("#vip-fields").removeClass("hidden");
      } else {
        $("#vip-fields").addClass("hidden");
      }
      validateCustomerLoginForm();
    });

    // Validate Customer Login Form
    $("#table-number, #username, #password").on("input", () => {
      validateCustomerLoginForm();
    });

    function validateCustomerLoginForm() {
      const tableNumber = $("#table-number").val();
      const isVIP = $("#vip-toggle").is(":checked");
      const username = $("#username").val();
      const password = $("#password").val();

      if (tableNumber && (!isVIP || (username && password))) {
        $("#customer-login-submit").prop("disabled", false);
      } else {
        $("#customer-login-submit").prop("disabled", true);
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

    // Initial validation check
    validateEmployeeLoginForm();

    // // Handle Customer Login Submit
    // $("#customer-login-submit").click((event) => {
    //   event.preventDefault();
    //   this.handleCustomerLogin(event);
    // });

    // // Handle Employee Login Submit
    // $("#employee-login-submit").click((event) => {
    //   event.preventDefault();
    //   this.handleEmployeeLogin(event);
    // });
  }

  bindCustomerLogin(handler) {
    $("#customer-login-form").on("submit", handler);
  }

  bindEmployeeLogin(handler) {
    $("#employee-login-form").on("submit", handler);
  }
}

export default LoginView;
