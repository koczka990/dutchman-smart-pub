import Database from "./database.js";

class MenuModel {
  constructor() {
    this.beverages = [];
    this.foods = [];
  }

  // Load menu items from the json files
  async loadMenuData() {
    try {
      const beveragesResponse = await fetch("/data/beverages.json");
      this.beverages = await beveragesResponse.json();

      const foodsResponse = await fetch("/data/foods.json");
      this.foods = await foodsResponse.json();
    } catch (error) {
      console.error("Error loading menu data:", error);
    }
  }

  getAllBeverages() {
    if (!this.beverages) return [];
    return this.beverages.map((beverage) => ({
      name: beverage.name,
      producer: beverage.producer,
      countryoforiginlandname: beverage.countryoforiginlandname,
      catgegory: beverage.catgegory,
      alcoholstrength: beverage.alcoholstrength,
      packaging: beverage.packaging,
      priceinclvat: beverage.priceinclvat,
      articletype: beverage.articletype
    }));
  }

  getAllFoods() {
    if (!this.foods) return [];
    return this.foods.map((food) => ({
      name: food.name,
      priceinclvat: food.priceinclvat,
      category: food.category,
      producer: food.producer,
      articletype: food.articletype,
      packaging: food.packaging
    }));
  }

  // // Load menu items from the database
  // loadMenuItems() {
  //   return Database.load("menuItems") || [];
  // }

  // // Save menu items to the database
  // saveMenuItems(menuItems) {
  //   Database.save("menuItems", menuItems);
  // }

  // // Get a menu item by ID
  // getMenuItem(id) {
  //   const menuItems = this.loadMenuItems();
  //   return menuItems.find((item) => item.id === id);
  // }

  // // Update stock level for a menu item
  // updateStock(id, quantity) {
  //   const menuItems = this.loadMenuItems();
  //   const item = menuItems.find((item) => item.id === id);
  //   if (item) {
  //     item.stock -= quantity;
  //     this.saveMenuItems(menuItems);
  //   }
  // }

  // // Add a new menu item
  // addMenuItem(item) {
  //   const menuItems = this.loadMenuItems();
  //   menuItems.push(item);
  //   this.saveMenuItems(menuItems);
  // }

  // // Remove a menu item
  // removeMenuItem(id) {
  //   let menuItems = this.loadMenuItems();
  //   menuItems = menuItems.filter((item) => item.id !== id);
  //   this.saveMenuItems(menuItems);
  // }
}

export default MenuModel;
