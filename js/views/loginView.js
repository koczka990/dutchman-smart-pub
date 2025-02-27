class LoginView {
  constructor() {
    this.appContent = document.getElementById("app-content");
  }

  render() {
    this.appContent.innerHTML = `
     <div class="login-container">
       <h1 class="login-text">Welcome to the Dutchman</h1>
       <div class="login-options">
         <button id="customer-login-btn" class="login-btn">Customer Login</button>
         <button id="employee-login-btn" class="login-btn">Employee Login</button>
       </div>

       <!-- Customer Login Form -->
       <form id="customer-login-form" class="hidden">
         <div class="form-group">
           <label for="table-number">Table Number</label>
           <input type="number" id="table-number" placeholder="Enter table number" required>
         </div>

         <div class="form-group">
           <label for="vip-toggle">VIP User</label>
           <label class="toggle-switch">
             <input type="checkbox" id="vip-toggle">
             <span class="slider"></span>
           </label>
         </div>

         <div id="vip-fields" class="hidden">
           <div class="form-group">
             <label for="username">Username</label>
             <input type="text" id="username" placeholder="Enter username">
           </div>
           <div class="form-group">
             <label for="password">Password</label>
             <input type="password" id="password" placeholder="Enter password">
           </div>
         </div>

         <button type="submit" id="customer-login-submit" class="login-btn" disabled>Login</button>
       </form>

       <!-- Employee Login Form -->
       <form id="employee-login-form" class="hidden">
         <div class="form-group">
           <label for="employee-username">Username</label>
           <input type="text" id="employee-username" placeholder="Enter username" required>
         </div>
         <div class="form-group">
           <label for="employee-password">Password</label>
           <input type="password" id="employee-password" placeholder="Enter password" required>
         </div>

         <button type="submit" id="employee-login-submit" class="login-btn">Login</button>
       </form>
     </div>
   `;
    this.setupEventListeners();
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
    console.log("Binding Customer Login");
    console.log(handler);
    $("#customer-login-form").on("submit", handler);
  }

  bindEmployeeLogin(handler) {
    $("#employee-login-form").on("submit", handler);
  }
}

export default LoginView;
