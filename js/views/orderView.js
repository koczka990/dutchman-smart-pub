class OrderView {
  constructor() {}

  async render(orderData) {
    this.appContent = document.getElementById("app-content");
    try {
      const response = await fetch("js/html/order.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      this.populateOrders(orderData);
    } catch (error) {
      console.error("Error loading order.html:", error);
    }
  }

  populateOrders(orderData) {
    const container = document.getElementById("employee-order-container");
    container.innerHTML = ""; // Clear previous content

    orderData.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("employee-table-card");
      if (order.isVIP) orderCard.classList.add("vip");

      orderCard.innerHTML = `
          <h3>Table ${order.tableNumber} (${order.status})</h3>
          <ul class="employee-order-list">
              ${order.items
                .map((item) => `<li>${item.name} - ${item.quantity}</li>`)
                .join("")}
          </ul>
          <p><strong>Total: $${order.totalAmount}</strong></p>
          <small>Ordered at: ${new Date(
            order.timestamp
          ).toLocaleString()}</small>
      `;

      container.appendChild(orderCard);
    });
  }
}

export default OrderView;
