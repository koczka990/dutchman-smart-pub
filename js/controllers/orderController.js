$(document).ready(function () {
    const orderItemsContainer = $("#order-items");
    const order = JSON.parse(localStorage.getItem("currentOrder")) || [];
  
    // Display order items
    order.forEach((item) => {
      const orderItem = `
        <div class="order-item">
          <span>${item.name} (x${item.quantity})</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `;
      orderItemsContainer.append(orderItem);
    });
  
    // Back to Menu button
    $("#back-to-menu-btn").click(function () {
      window.location.href = "menu.html";
    });
  });