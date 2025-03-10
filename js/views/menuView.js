class MenuView {
  constructor(controller) {
    this.controller = controller;
    this.appContent = document.getElementById("app-content");
  }

  async render(beverages, foods, userInfo) {
    this.beverages = beverages;
    this.foods = foods;

    try {
      const response = await fetch("js/html/menu.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      this.displayCustomerInfo(userInfo);
      this.populateMenuItems(foods);
      this.setupEventListeners();
      this.setupOrderListDropZone(); // Ensures order list only gets drop events once
    } catch (error) {
      console.error("Error loading menu.html:", error);
    }
  }

  displayCustomerInfo(userInfo) {
    const vipInfoDiv = document.getElementById("vip-info");
    console.log("Displaying user info:", userInfo);
    console.log("VIP info div:", vipInfoDiv);

    // Show/hide VIP information based on login type
    if (userInfo.isVIP) {
      console.log("User is VIP, showing VIP information");
      vipInfoDiv.classList.remove("hidden");
      const nameElement = document.getElementById("display-customer-name");
      const balanceElement = document.getElementById("display-balance");
      const tableElement = document.getElementById("display-table-number");
      
      console.log("Elements found:", {
        nameElement: !!nameElement,
        balanceElement: !!balanceElement,
        tableElement: !!tableElement
      });

      if (nameElement) nameElement.textContent = userInfo.username;
      if (balanceElement) balanceElement.textContent = `$${parseFloat(userInfo.balance).toFixed(2)}`;
      if (tableElement) tableElement.textContent = userInfo.tableNumber;
    } else {
      console.log("User is not VIP, hiding VIP information");
      vipInfoDiv.classList.add("hidden");
      const tableElement = document.getElementById("display-table-number");
      if (tableElement) tableElement.textContent = userInfo.tableNumber;
    }
  }

  populateMenuItems(items) {
    const menuItems = document.getElementById("menu-items");
    if (!menuItems) return;

    menuItems.innerHTML = items
        .map(({ name, priceinclvat }) => {
          // Ensure price is a valid number, otherwise default to 0
          const price = parseFloat(priceinclvat) || 0;
          const formattedPrice = `$${price.toFixed(2)}`;

          return `
            <div class="menu-item" draggable="true" data-name="${name}" data-priceinclvat="${price}">
              <span class="item-name">${name}</span>
              <span class="item-price">${formattedPrice}</span>
              <span class="info-icon" data-name="${name}">ℹ</span>
            </div>
          `;
        })
      .join("");

    this.setupMenuItemDragEvents();
    this.setupMenuItemClickEvents(); // Setup click event listeners
    this.setupInfoClickEvents(items);
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
        event.dataTransfer.setData("name", item.dataset.name);
        event.dataTransfer.setData("price", item.dataset.priceinclvat);
      });
    });
  }

  setupMenuItemClickEvents() {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        const selectedItem = {
          name: item.dataset.name,
          priceinclvat: parseFloat(item.dataset.priceinclvat) || 0
        };

        this.addItemToOrder(selectedItem);
      });
    });
  }

  setupOrderListDropZone(items) {
    const orderList = document.getElementById("order-list");

    orderList.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    orderList.addEventListener("drop", (event) => {
      event.preventDefault();
      const itemName = event.dataTransfer.getData("name");
      const itemPrice = event.dataTransfer.getData("price");
      if (itemName && itemPrice) {
        const selectedItem = {
          name: itemName,
          priceinclvat: parseFloat(itemPrice)
        };
        this.addItemToOrder(selectedItem);
      } else {
        console.error("Dragged item data is missing.");
      }
    });
  }

  addItemToOrder(selectedItem) {
    const orderList = document.getElementById("order-list");

    if (!selectedItem) return;

    let existingItem = [...orderList.children].find(
      (li) => li.dataset.name === selectedItem.name
    );

    if (existingItem) {
      let quantitySpan = existingItem.querySelector(".order-btn span");
      quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
    } else {
      const listItem = document.createElement("li");
      listItem.setAttribute("draggable", "true");
      listItem.setAttribute("data-name", selectedItem.name);
      listItem.setAttribute("data-price", selectedItem.priceinclvat);
      listItem.innerHTML = `
        <span>${selectedItem.name} - $${parseFloat(selectedItem.priceinclvat).toFixed(2)}</span>
        <span class="order-btn">
          <button class="decrease-btn" type="button">-</button>
          <span>1</span>
          <button class="increase-btn" type="button">+</button>
        </span>
      `;

      orderList.appendChild(listItem);
      this.setupQuantityButtons(listItem);
    }
    if (document.getElementById("subtotal") && document.getElementById("total")) {
      this.updateOrderSummary();
    } else {
      console.error("Order summary elements are missing.");
    }
  }

  setupQuantityButtons(listItem) {
    const decreaseBtn = listItem.querySelector(".decrease-btn");
    const increaseBtn = listItem.querySelector(".increase-btn");
    const quantitySpan = listItem.querySelector(".order-btn span");

    increaseBtn.addEventListener("click", () => {
      quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
      this.updateOrderSummary();
    });

    decreaseBtn.addEventListener("click", () => {
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantitySpan.textContent = quantity - 1;
      } else {
        listItem.remove();
      }
      this.updateOrderSummary();
    });
  }

  updateOrderSummary() {
    const orderList = document.getElementById("order-list");
    let subtotal = 0;

    // Loop through each order item in the UI
    [...orderList.children].forEach(listItem => {
      const itemPrice = parseFloat(listItem.dataset.price); // Read price from dataset
      const quantity = parseInt(listItem.querySelector(".order-btn span").textContent); // Read quantity from UI
      subtotal += itemPrice * quantity;
    });

    let total = subtotal; // No extra tax needed (price includes VAT)

    // Update order summary in UI
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }

  confirmOrder() {
    const orderList = document.getElementById("order-list").children;

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
      const itemPrice = parseFloat(item.dataset.price || "0");
      items.push({ name: itemName, quantity, price: itemPrice });
    });

    console.log("Items in the order:", items);

    this.controller.handleConfirmOrder(items);
  }

  clearOrderList() {
    document.getElementById("order-list").innerHTML = "";
  }

  setupInfoClickEvents(items) {
    document.querySelectorAll(".info-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        event.stopPropagation();

        const itemName = event.target.dataset.name;
        const selectedItem = items.find(i => i.name === itemName);

        const infoSection = document.getElementById("info-section");
        if (!infoSection) {
          console.error("Info section not found in the document.");
          return;
        }

        if (selectedItem) {
          let detailsHTML = `
            <h3>${selectedItem.name}</h3>
          `;

          // If the item is food, display food-related details
          if (selectedItem.articletype === "200") {
            detailsHTML += `
                        <p><strong>Category:</strong> ${selectedItem.category || "N/A"}</p>
                        <p><strong>Producer:</strong> ${selectedItem.producer || "N/A"}</p>
                        <p><strong>Packaging:</strong> ${selectedItem.packaging || "N/A"}</p>
                    `;
          } else {
            detailsHTML += `
                        <p><strong>Producer:</strong> ${selectedItem.producer || "N/A"}</p>
                        <p><strong>Country:</strong> ${selectedItem.countryoforigin || "N/A"} ml</p>
                        <p><strong>Strength:</strong> ${selectedItem.alcoholstrength || "N/A"}%</p>
                        <p><strong>Serving size:</strong> ${selectedItem.packaging || "N/A"}</p>
                    `;
          }

          infoSection.innerHTML = detailsHTML;

          // Get the position of the clicked info button
          const iconRect = event.target.getBoundingClientRect();

          // Position the info box next to the clicked item
          infoSection.style.top = `${window.scrollY + iconRect.top}px`;
          infoSection.style.left = `${window.scrollX + iconRect.right + 10}px`;

          infoSection.classList.add("visible");        }
      });
    });
    document.addEventListener("click", (event) => {
      const infoSection = document.getElementById("info-section");
      if (infoSection && !event.target.closest(".info-container") && !event.target.classList.contains("info-icon")) {
        infoSection.classList.remove("visible");
      }
    });
  }
}

export default MenuView;
