class MenuView {
  constructor() {
    this.appContent = document.getElementById("app-content");
  }

  render(beverages, foods) {
    this.beverages = beverages;
    this.foods = foods;

    this.appContent.innerHTML = `
      <div class="dashboard-container">
        <div class="menu-container">
          <h3>Products</h3>
          
          <!-- Tabs for Food & Drinks -->
          <div class="menu-tabs">
            <button id="food-tab" class="active">🍔 Food</button>
            <button id="drinks-tab">🍹 Drinks</button>
          </div>
          
          <!-- Menu Items (Will change when clicking tabs) -->
          <div class="menus" id="menu-items">
            ${foods
              .map((name) => `<div class="menu-item">${name}</div>`)
              .join("")}
          </div>
        </div>

        <div class="order-container">
          <div class="customer-container">
            <h3>Customer Information</h3>
            <label for="customer-name">Customer Name:</label>
            <input type="text" id="customer-name" name="customer-name">
            <br><br>
            <label for="table-select">Table Number:</label>
            <select name="table" id="table-select">
              <option value="">--Choose a table--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>

          <h3>Order Details</h3>  
          <ul class="order-list" id="order-list">
            <li>
              <span>Pizza</span>
              <span class="order-btn">
                <button id="decrease-btn" type="button">-</button>
                <span>1</span>
                <button id="increase-btn" type="button">+</button>
              </span>
            </li>
            <li>
              <span>Burger</span>
              <span class="order-btn">
                <button id="decrease-btn" type="button">-</button>
                <span>1</span>
                <button id="increase-btn" type="button">+</button>
              </span>
            </li>
          </ul>

          <hr>
          <h3>Order Summary</h3>
          <div class="order-summary">
            <h4><span>Subtotal:</span> <span>$69.90</span></h4>
            <h4><span>Tax(10%):</span> <span>$6.99</span></h4>
            <hr>
            <h4><span>Total:</span> <span>$76.89</span></h4>
          </div>

          <button id="confirm-btn" type="button">Confirm</button>
          <button id="clear-btn" type="button">Clear</button>
        </div>
      </div> 
    `;

    // Call function to enable tab switching
    this.setupEventListeners();
  }

  setupEventListeners() {
    const foodTab = document.getElementById("food-tab");
    const drinksTab = document.getElementById("drinks-tab");
    const menuItems = document.getElementById("menu-items");

    foodTab.addEventListener("click", () => {
      foodTab.classList.add("active");
      drinksTab.classList.remove("active");
      menuItems.innerHTML = this.foods
        .map((name) => `<div class="menu-item">${name}</div>`)
        .join("");
    });

    drinksTab.addEventListener("click", () => {
      drinksTab.classList.add("active");
      foodTab.classList.remove("active");
      menuItems.innerHTML = this.beverages
        .map((name) => `<div class="menu-item">${name}</div>`)
        .join("");
    });
  }
}

export default MenuView;
