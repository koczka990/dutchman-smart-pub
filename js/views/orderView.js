class OrderView {
  constructor(controller) {
    this.controller = controller;
    this.completeOrderCallback = null;
    this.currentFilter = 'all'; // Default filter
    this.allOrders = []; // Store all orders for filtering
  }

  // Set the callback function for completing an order
  setCompleteOrderCallback(callback) {
    this.completeOrderCallback = callback;
  }

  async render(orderData) {
    this.appContent = document.getElementById("app-content");
    try {
      const response = await fetch("js/html/order.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      // Store all orders for filtering
      this.allOrders = orderData;
      
      // Setup filter tabs event listeners
      this.setupFilterTabs();
      
      // Populate orders based on current filter
      this.applyFilter();
    } catch (error) {
      console.error("Error loading order.html:", error);
    }
  }

  setupFilterTabs() {
    const allTab = document.getElementById("all-orders-tab");
    const pendingTab = document.getElementById("pending-orders-tab");
    const doneTab = document.getElementById("done-orders-tab");
    
    if (allTab && pendingTab && doneTab) {
      allTab.addEventListener("click", () => this.setFilter('all', allTab, [pendingTab, doneTab]));
      pendingTab.addEventListener("click", () => this.setFilter('pending', pendingTab, [allTab, doneTab]));
      doneTab.addEventListener("click", () => this.setFilter('done', doneTab, [allTab, pendingTab]));
    }
  }

  setFilter(filter, activeTab, inactiveTabs) {
    this.currentFilter = filter;
    
    // Update tab styling
    activeTab.classList.add('active');
    inactiveTabs.forEach(tab => tab.classList.remove('active'));
    
    // Apply the filter
    this.applyFilter();
  }

  applyFilter() {
    let filteredOrders;
    
    // Filter orders based on current filter
    if (this.currentFilter === 'all') {
      filteredOrders = this.allOrders;
    } else if (this.currentFilter === 'pending') {
      filteredOrders = this.allOrders.filter(order => order.status === 'pending');
    } else if (this.currentFilter === 'done') {
      filteredOrders = this.allOrders.filter(order => order.status === 'done');
    }
    
    // Populate the orders with the filtered data
    this.populateOrders(filteredOrders);
  }

  populateOrders(orderData) {
    const container = document.getElementById("employee-order-container");
    container.innerHTML = ""; // Clear previous content

    if (orderData.length === 0) {
      container.innerHTML = `<p class="no-orders-message" data-translate-key="no-order-message">${this.controller.app.languageSwitcher.translate("no-order-message")}</p>`;
      return;
    }

    orderData.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("employee-table-card");
      if (order.isVIP) orderCard.classList.add("vip");

      // Add a complete button only for pending orders
      const completeButton = order.status === "pending" 
        ? `<button class="complete-order-btn" data-order-id="${order.id}" data-translate-key="complete-order-btn">${this.controller.app.languageSwitcher.translate("complete-order-btn")}</button>`
        : '';

      orderCard.innerHTML = `
          <h3><span data-translate-key="table-number-field">${this.controller.app.languageSwitcher.translate("table-number-field")}</span> &nbsp;${order.tableNumber} (${order.status})</h3>
          <ul class="employee-order-list">
              ${order.items
                .map((item) => `<li>${item.name} - ${item.quantity}</li>`)
                .join("")}
          </ul>
          <p><strong class="order-total"><span data-translate-key="total-field">${this.controller.app.languageSwitcher.translate("total-field")}</span> &nbsp;$${
            order.totalAmount
          }</strong></p>
          <small class="order-time"><span data-translate-key="order-time">${this.controller.app.languageSwitcher.translate("order-time")}</span> &nbsp;${new Date(
            order.timestamp
          ).toLocaleString()}</small>
          ${completeButton}
      `;

      container.appendChild(orderCard);
    });

    // Add event listeners to complete buttons
    this.addCompleteButtonListeners();
  }

  addCompleteButtonListeners() {
    const completeButtons = document.querySelectorAll('.complete-order-btn');
    completeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const orderId = parseInt(event.target.getAttribute('data-order-id'));
        if (this.completeOrderCallback) {
          this.completeOrderCallback(orderId);
        }
      });
    });
  }
}

export default OrderView;
