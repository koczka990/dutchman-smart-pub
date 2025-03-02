class MenuView {
  constructor() {
    this.appContent = document.getElementById("app-content");
  }

  async render(beverages, foods) {
    this.beverages = beverages;
    this.foods = foods;

    try {
      const response = await fetch("js/html/menu.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      // Fill in the menu
      this.populateMenuItems(foods);

      // Call function to enable tab switching
      this.setupEventListeners();
    } catch (error) {
      console.error("Error loading menu.html:", error);
    }
  }

  populateMenuItems(items) {
    const menuItems = document.getElementById("menu-items");
    if (!menuItems) return;

    menuItems.innerHTML = items
      .map((name) => `<div class="menu-item">${name}</div>`)
      .join("");
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
