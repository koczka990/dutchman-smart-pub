import MenuModel  from "../models/menuModel";

class MenuView {
    constructor(updateOrder) {
        this.updateOrder = updateOrder;
    }

    render() {
        const appContent = document.getElementById("menu-container");
        const menuItems = MenuModel.loadMenuItems();
        const foods = menuItems.filter(item => item.type === "Food");
        const beverages = menuItems.filter(item => item.type !== "Food");

        appContent.innerHTML = `
          <h3>Products</h3>
          
          <!-- Tabs for Food & Drinks -->
          <div class="menu-tabs">
            <button id="food-tab" class="active">🍔 Food</button>
            <button id="drinks-tab">🍹 Drinks</button>
          </div>
          
          <!-- Menu Items -->
          <div class="menus" id="menu-items">
            ${foods.map(item => this.createMenuItem(item)).join("")}
          </div>
        `;

        this.setupEventListeners();
    }

    createMenuItem(item) {
        return `
          <div class="menu-item" 
              draggable="true" 
              data-name="${item.name}" 
              data-price="${item.priceinclvat}">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.priceinclvat}</span>
          </div>
        `;
    }

    setupEventListeners() {
        const foodTab = document.getElementById("food-tab");
        const drinksTab = document.getElementById("drinks-tab");
        const menuItems = document.getElementById("menu-items");

        foodTab.addEventListener("click", () => {
            foodTab.classList.add("active");
            drinksTab.classList.remove("active");
            menuItems.innerHTML = getAllFoodNames().map(item => this.createMenuItem(item)).join("");
        });

        drinksTab.addEventListener("click", () => {
            drinksTab.classList.add("active");
            foodTab.classList.remove("active");
            menuItems.innerHTML = getAllBeverageNames().map(item => this.createMenuItem(item)).join("");
        });

        document.querySelectorAll(".menu-item").forEach(item => {
            item.addEventListener("click", (event) => {
                const name = event.target.getAttribute("data-name");
                const price = event.target.getAttribute("data-price");
                this.updateOrder(name, price);
            });
        });
    }
}

export default MenuView;