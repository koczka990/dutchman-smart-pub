class MenuView {
  constructor(controller) {
    this.controller = controller;
    this.appContent = document.getElementById("app-content");
    this.undoStack = []; // Stores previous states
    this.redoStack = []; // Stores undone states
  }

  async render(drinks, foods, vip_drinks, vip_foods, userInfo) {
    this.drinks = drinks;
    this.foods = foods;
    this.vip_drinks = vip_drinks;
    this.vip_foods = vip_foods;

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
    const vipFoodTab = document.getElementById("vip-food-tab");
    const vipDrinksTab = document.getElementById("vip-drinks-tab");
    console.log("Displaying user info:", userInfo);
    console.log("VIP info div:", vipInfoDiv);

    // Show/hide VIP information based on login type
    if (userInfo.isVIP) {
      console.log("User is VIP, showing VIP information");
      vipInfoDiv.classList.remove("hidden");
      vipFoodTab.classList.remove("hidden");
      vipDrinksTab.classList.remove("hidden");

      const nameElement = document.getElementById("display-customer-name");
      const balanceElement = document.getElementById("display-balance");
      const tableElement = document.getElementById("display-table-number");

      console.log("Elements found:", {
        nameElement: !!nameElement,
        balanceElement: !!balanceElement,
        tableElement: !!tableElement,
      });

      if (nameElement) nameElement.textContent = userInfo.username;
      if (balanceElement)
        balanceElement.textContent = `$${parseFloat(userInfo.balance).toFixed(
          2
        )}`;
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
      .map(({ name, priceinclvat, articleNumber }) => {
        // Ensure price is a valid number, otherwise default to 0
        const price = parseFloat(priceinclvat) || 0;
        const formattedPrice = `$${price.toFixed(2)}`;
        const itemImg = `../data/img/${articleNumber}.png`;

        return `
            <div class="menu-item" draggable="true" data-name="${name}" data-priceinclvat="${price}">
              <img  class="item-img" src="${itemImg}" alt="${name}" />
              <div class="item-info">
                <div class="item-name">${name}</div>
                <div class="item-price">${formattedPrice}</div>
                <div class="info-icon" data-name="${name}">ℹ</div>
              </div>
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
    const vipFoodTab = document.getElementById("vip-food-tab");
    const vipDrinksTab = document.getElementById("vip-drinks-tab");
    const confirmButton = document.getElementById("confirm-btn");
    const subcategories = document.querySelectorAll(".subcategory");
    const clearButton = document.getElementById("clear-btn");

    const tabs = [foodTab, drinksTab, vipFoodTab, vipDrinksTab];

    const undoButton = document.getElementById("undo-btn");
    const redoButton = document.getElementById("redo-btn");

    foodTab.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      foodTab.classList.add("active");
      this.populateMenuItems(this.foods);
    });

    subcategories.forEach((button) => {
      button.addEventListener("click", () => {
        const subcategory = button.getAttribute("id");
        this.populateMenuItems(
          this.drinks.filter((item) => item.category === subcategory)
        );
      });
    });

    drinksTab.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      drinksTab.classList.add("active");
      this.populateMenuItems(this.drinks);
    });

    vipFoodTab.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      vipFoodTab.classList.add("active");
      this.populateMenuItems(this.vip_foods);
    });

    vipDrinksTab.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      vipDrinksTab.classList.add("active");
      this.populateMenuItems(this.vip_drinks);
    });

    confirmButton.addEventListener("click", () => {
      this.confirmOrder();
    });

    clearButton.addEventListener("click", () => {
      this.clearOrderList();
    });

    if (undoButton) {
      undoButton.addEventListener("click", () => this.undo());
    }
    if (redoButton) {
      redoButton.addEventListener("click", () => this.redo());
    }
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
          priceinclvat: parseFloat(item.dataset.priceinclvat) || 0,
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
          priceinclvat: parseFloat(itemPrice),
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

    // Save the current state before modifying
    this.saveState();

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
        <span>${selectedItem.name} - $${parseFloat(
        selectedItem.priceinclvat
      ).toFixed(2)}</span>
        <span class="order-btn">
          <button class="decrease-btn" type="button">-</button>
          <span>1</span>
          <button class="increase-btn" type="button">+</button>
        </span>
      `;

      orderList.appendChild(listItem);
      this.setupQuantityButtons(listItem);
    }
    if (document.getElementById("total")) {
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
      this.saveState(); // Save state before changing
      quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
      this.updateOrderSummary();
    });

    decreaseBtn.addEventListener("click", () => {
      this.saveState(); // Save state before changing
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantitySpan.textContent = quantity - 1;
      } else {
        listItem.remove();
      }
      this.updateOrderSummary();
    });
  }

  saveState() {
    const orderList = document.getElementById("order-list");
    const currentState = [...orderList.children].map((item) => ({
      name: item.dataset.name,
      price: parseFloat(item.dataset.price),
      quantity: parseInt(item.querySelector(".order-btn span").textContent),
    }));

    this.undoStack.push(currentState);
    this.redoStack = []; // Clear redo stack when new action is performed
  }

  restoreState(state) {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    state.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("draggable", "true");
      listItem.setAttribute("data-name", item.name);
      listItem.setAttribute("data-price", item.price);
      listItem.innerHTML = `
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <span class="order-btn">
          <button class="decrease-btn" type="button">-</button>
          <span>${item.quantity}</span>
          <button class="increase-btn" type="button">+</button>
        </span>
      `;

      orderList.appendChild(listItem);
      this.setupQuantityButtons(listItem);
    });

    this.updateOrderSummary();
  }

  undo() {
    if (this.undoStack.length === 0) return;

    const currentState = [
      ...document.getElementById("order-list").children,
    ].map((item) => ({
      name: item.dataset.name,
      price: parseFloat(item.dataset.price),
      quantity: parseInt(item.querySelector(".order-btn span").textContent),
    }));

    this.redoStack.push(currentState); // Save current state before undoing
    const previousState = this.undoStack.pop();
    this.restoreState(previousState);
  }

  redo() {
    if (this.redoStack.length === 0) return;

    const currentState = [
      ...document.getElementById("order-list").children,
    ].map((item) => ({
      name: item.dataset.name,
      price: parseFloat(item.dataset.price),
      quantity: parseInt(item.querySelector(".order-btn span").textContent),
    }));

    this.undoStack.push(currentState); // Save current state before redoing
    const nextState = this.redoStack.pop();
    this.restoreState(nextState);
  }

  updateOrderSummary() {
    const orderList = document.getElementById("order-list");
    let total = 0;

    // Loop through each order item in the UI
    [...orderList.children].forEach((listItem) => {
      const itemPrice = parseFloat(listItem.dataset.price); // Read price from dataset
      const quantity = parseInt(
        listItem.querySelector(".order-btn span").textContent
      ); // Read quantity from UI
      total += itemPrice * quantity;
    });

    // Update order summary in UI
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }

  confirmOrder() {
    const orderList = document.getElementById("order-list").children;

    if (orderList.length === 0) {
      alert(this.controller.app.languageSwitcher.translate("No items in the order. Please add some items before confirming."));
      return;
    }

    let items = [];
    [...orderList].forEach((item) => {
      const itemName = item.dataset.name;
      const quantity = parseInt(item.querySelector(".order-btn span").textContent);
      const itemPrice = parseFloat(item.dataset.price || "0");
      items.push({ name: itemName, quantity, price: itemPrice });
    });

    // Get user info from the controller
    const userInfo = this.controller.getUserInfo();
    console.log("Confirming order with user info:", userInfo);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create and show confirmation popup
    const popup = document.createElement("div");
    popup.className = "order-confirmation-popup";
    popup.innerHTML = `
    <div class="popup-content">
      <h2 data-translate-key="Confirm Order">${this.controller.app.languageSwitcher.translate("Confirm Order")}</h2>
      <div class="order-summary">
        <h3 data-translate-key="Order Summary:">${this.controller.app.languageSwitcher.translate("Order Summary:")}</h3>
        <ul>
          ${items.map(item => `
            <li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
          `).join("")}
        </ul>
        <p class="total"><span data-translate-key="Total:">${this.controller.app.languageSwitcher.translate("Total:")}</span> &nbsp;${totalAmount.toFixed(2)}</p>
        ${userInfo.isVIP ? `
          <p class="balance-info"><span data-translate-key="Current Balance:">${this.controller.app.languageSwitcher.translate("Current Balance:")}</span> &nbsp;$${parseFloat(userInfo.balance).toFixed(2)}</p>
          <p class="new-balance"><span data-translate-key="New Balance:">${this.controller.app.languageSwitcher.translate("New Balance:")}</span> &nbsp;$${(parseFloat(userInfo.balance) - totalAmount).toFixed(2)}</p>
        ` : ""}
      </div>
      <div class="popup-buttons">
        <button class="cancel-btn" data-translate-key="Cancel">${this.controller.app.languageSwitcher.translate("Cancel")}</button>
        <button class="confirm-btn" data-translate-key="Confirm Order">${this.controller.app.languageSwitcher.translate("Confirm Order")}</button>
      </div>
    </div>
  `;

    document.body.appendChild(popup);

    popup.querySelector(".cancel-btn").addEventListener("click", () => {
      document.body.removeChild(popup);
    });

    popup.querySelector('.confirm-btn').addEventListener('click', () => {
      if (userInfo.isVIP) {
        this.controller.handleConfirmOrder(items, userInfo);
        document.body.removeChild(popup);
      } else {
        document.body.removeChild(popup);
        this.controller.handleRegularCustomerOrder(items, userInfo);
      }
    });
  }

  clearOrderList() {
    document.getElementById("order-list").innerHTML = "";
    let totalPriceElement = document.getElementById("total");
    if (totalPriceElement) {
      totalPriceElement.textContent = "0";
    }
  }

  setupInfoClickEvents(items) {
    document.querySelectorAll(".info-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        event.stopPropagation();

        const itemName = event.target.dataset.name;
        const selectedItem = items.find((i) => i.name === itemName);

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
                <p>
                  <strong data-translate-key="info-category-field">
                    ${this.controller.app.languageSwitcher.translate("info-producer-field")}
                  </strong>
                  ${selectedItem.category || "N/A"}
                </p>
                <p>
                  <strong data-translate-key="info-producer-field">
                    ${this.controller.app.languageSwitcher.translate("info-producer-field")}
                  </strong> 
                  ${selectedItem.producer || "N/A"}
                </p>
                <p>
                  <strong data-translate-key="info-packaging-field">
                    ${this.controller.app.languageSwitcher.translate("info-packaging-field")}
                  </strong> 
                  ${selectedItem.packaging || "N/A"
                }</p>
                    `;
          } else {
            detailsHTML += `
              <p>
                <strong data-translate-key="info-category-field">
                  ${this.controller.app.languageSwitcher.translate("info-producer-field")}
                </strong>
                ${selectedItem.category || "N/A"}
              </p>
              <p>
                <strong data-translate-key="info-country-field">
                  ${this.controller.app.languageSwitcher.translate("info-country-field")}
                </strong>
                ${selectedItem.countryoforigin || "N/A"}
              </p>
              <p>
                <strong data-translate-key="info-strength-field">
                  ${this.controller.app.languageSwitcher.translate("info-strength-field")}
                </strong> 
                ${selectedItem.alcoholstrength || "N/A"}
              </p>
              <p>
                <strong data-translate-key="info-serving-size-field">
                  ${this.controller.app.languageSwitcher.translate("info-serving-size-field")}
                </strong> 
                ${selectedItem.packaging || "N/A"}
              </p>
            `;
          }

          infoSection.innerHTML = detailsHTML;

          // Get the position of the clicked info button
          const iconRect = event.target.getBoundingClientRect();

          // Position the info box next to the clicked item
          infoSection.style.top = `${window.scrollY + iconRect.top}px`;
          infoSection.style.left = `${window.scrollX + iconRect.right + 10}px`;

          infoSection.classList.add("visible");
        }
      });
    });
    document.addEventListener("click", (event) => {
      const infoSection = document.getElementById("info-section");
      if (
        infoSection &&
        !event.target.closest(".info-container") &&
        !event.target.classList.contains("info-icon")
      ) {
        infoSection.classList.remove("visible");
      }
    });
  }
}

export default MenuView;
