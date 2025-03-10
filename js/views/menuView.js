class MenuView {
  constructor(controller) {
    this.controller = controller;
    this.appContent = document.getElementById("app-content");
  }

  async render(beverages, foods) {
    this.beverages = beverages;
    this.foods = foods;

    try {
      const response = await fetch("js/html/menu.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      this.displayCustomerInfo();
      this.populateMenuItems(foods);
      this.setupEventListeners();
      this.setupOrderListDropZone(); // Ensures order list only gets drop events once
    } catch (error) {
      console.error("Error loading menu.html:", error);
    }
  }

  displayCustomerInfo() {
    const username = localStorage.getItem("username");
    const tableNumber = localStorage.getItem("tableNumber") || "-";
    const balance = localStorage.getItem("balance");
    const vipInfoDiv = document.getElementById("vip-info");

    // Show/hide VIP information based on login type
    if (username && balance) {
      vipInfoDiv.classList.remove("hidden");
      document.getElementById("display-customer-name").textContent = username;
      document.getElementById("display-balance").textContent = `$${balance}`;
    } else {
      vipInfoDiv.classList.add("hidden");
    }

    document.getElementById("display-table-number").textContent = tableNumber;
  }

  populateMenuItems(items) {
    const menuItems = document.getElementById("menu-items");
    if (!menuItems) return;

    menuItems.innerHTML = items
      .map(
        (name) =>
          `<div class="menu-item" draggable="true" data-name="${name}">${name}</div>`
      )
      .join("");

    this.setupMenuItemDragEvents();
    this.setupMenuItemClickEvents(); // Setup click event listeners
  }

  setupEventListeners() {
    const foodTab = document.getElementById("food-tab");
    const drinksTab = document.getElementById("drinks-tab");
    const confirmButton = document.getElementById("confirm-btn");
    const clearButton = document.getElementById("clear-btn");

    foodTab.addEventListener("click", () => {
      foodTab.classList.add("active");
      drinksTab.classList.remove("active");
      this.populateMenuItems(this.foods);
    });

    drinksTab.addEventListener("click", () => {
      drinksTab.classList.add("active");
      foodTab.classList.remove("active");
      this.populateMenuItems(this.beverages);
    });

    confirmButton.addEventListener("click", () => {
      this.confirmOrder();
    });

    clearButton.addEventListener("click", () => {
      this.clearOrderList();
    });
  }

  setupMenuItemDragEvents() {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", item.dataset.name);
      });
    });
  }

  setupMenuItemClickEvents() {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.addItemToOrder(item.dataset.name);
      });
    });
  }

  setupOrderListDropZone() {
    const orderList = document.getElementById("order-list");

    orderList.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    orderList.addEventListener("drop", (event) => {
      event.preventDefault();
      const itemName = event.dataTransfer.getData("text/plain");
      if (itemName) {
        this.addItemToOrder(itemName);
      }
    });
  }

  addItemToOrder(itemName) {
    const orderList = document.getElementById("order-list");
    let existingItem = [...orderList.children].find(
      (li) => li.dataset.name === itemName
    );

    if (existingItem) {
      let quantitySpan = existingItem.querySelector(".order-btn span");
      quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
    } else {
      const listItem = document.createElement("li");
      listItem.setAttribute("draggable", "true");
      listItem.setAttribute("data-name", itemName);
      listItem.innerHTML = `
        <span>${itemName}</span>
        <span class="order-btn">
          <button class="decrease-btn" type="button">-</button>
          <span>1</span>
          <button class="increase-btn" type="button">+</button>
        </span>
      `;

      orderList.appendChild(listItem);
      this.setupQuantityButtons(listItem);
    }
  }

  setupQuantityButtons(listItem) {
    const decreaseBtn = listItem.querySelector(".decrease-btn");
    const increaseBtn = listItem.querySelector(".increase-btn");
    const quantitySpan = listItem.querySelector(".order-btn span");

    increaseBtn.addEventListener("click", () => {
      quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
    });

    decreaseBtn.addEventListener("click", () => {
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantitySpan.textContent = quantity - 1;
      } else {
        listItem.remove();
      }
    });
  }

  confirmOrder() {
    const orderList = document.getElementById("order-list").children;
    const tableNumber = localStorage.getItem("tableNumber");

    if (!tableNumber) {
      alert("No table number found. Please log in again.");
      return;
    }

    if (orderList.length === 0) {
      alert("No items in the order. Please add some items before confirming.");
      return;
    }

    let items = [];
    [...orderList].forEach((item) => {
      const itemName = item.dataset.name;
      const quantity = parseInt(
        item.querySelector(".order-btn span").textContent
      );
      items.push({ name: itemName, quantity });
    });

    this.controller.handleConfirmOrder(tableNumber, items);
  }

  clearOrderList() {
    document.getElementById("order-list").innerHTML = "";
  }
}

export default MenuView;
