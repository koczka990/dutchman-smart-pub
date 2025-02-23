import UserModel from "../models/userModel.js";

$("#customer-login-form").submit(function (event) {
  event.preventDefault();

  const tableNumber = $("#table-number").val();
  const isVIP = $("#vip-toggle").is(":checked");
  const username = $("#username").val();
  const password = $("#password").val();

  if (isVIP) {
    const user = UserModel.authenticate(username, password);
    if (user) {
      console.log("VIP Login Successful:", user);
      window.location.href = "menu.html"; // Redirect to menu page
    } else {
      alert("Invalid username or password.");
    }
  } else {
    console.log("Customer Login:", { tableNumber });
    window.location.href = "menu.html"; // Redirect to menu page
  }
});

$("#employee-login-form").submit(function (event) {
  event.preventDefault();

  const username = $("#employee-username").val();
  const password = $("#employee-password").val();

  const user = UserModel.authenticate(username, password);
  if (user) {
    console.log("Employee Login Successful:", user);
    window.location.href = "menu.html"; // Redirect to menu page
  } else {
    alert("Invalid username or password.");
  }
});