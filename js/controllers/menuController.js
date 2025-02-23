import MenuModel from "../models/menuModel.js";

$(document).ready(function () {
  // Load and display menu items
  const menuItems = MenuModel.loadMenuItems();
  const menuItemsContainer = $("#menu-items");

  menuItems.forEach((item) => {
    const menuItem = `
      <div class="menu-item">
        <h3>${item.name}</h3>
        <p>Type: ${item.type}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>Stock: ${item.stock}</p>
      </div>
    `;
    menuItemsContainer.append(menuItem);
  });

  // Logout button
  $("#logout-btn").click(function () {
    window.location.href = "index.html";
  });
});