$(document).ready(function() {
  // Show Customer Login Form
  $("#customer-login-btn").click(function() {
    $("#customer-login-form").removeClass("hidden");
    $("#employee-login-form").addClass("hidden");
  });

  // Show Employee Login Form
  $("#employee-login-btn").click(function() {
    $("#employee-login-form").removeClass("hidden");
    $("#customer-login-form").addClass("hidden");
  });

  // Toggle VIP Fields
  $("#vip-toggle").change(function() {
    if (this.checked) {
      $("#vip-fields").removeClass("hidden");
    } else {
      $("#vip-fields").addClass("hidden");
    }
    validateCustomerLoginForm();
  });

  // Validate Customer Login Form
  $("#table-number, #username, #password").on("input", function() {
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
});