import Database from "./database.js";

const MenuModel = {
  // Load menu items from the database
  loadMenuItems: function () {
    return Database.load("menuItems") || [];
  },

  // Save menu items to the database
  saveMenuItems: function (menuItems) {
    Database.save("menuItems", menuItems);
  },

  // Get a menu item by ID
  getMenuItem: function (id) {
    const menuItems = this.loadMenuItems();
    return menuItems.find((item) => item.id === id);
  },

  // Update stock level for a menu item
  updateStock: function (id, quantity) {
    const menuItems = this.loadMenuItems();
    const item = menuItems.find((item) => item.id === id);
    if (item) {
      item.stock -= quantity;
      this.saveMenuItems(menuItems);
    }
  },

  // Add a new menu item
  addMenuItem: function (item) {
    const menuItems = this.loadMenuItems();
    menuItems.push(item);
    this.saveMenuItems(menuItems);
  },

  // Remove a menu item
  removeMenuItem: function (id) {
    let menuItems = this.loadMenuItems();
    menuItems = menuItems.filter((item) => item.id !== id);
    this.saveMenuItems(menuItems);
  },
};

export default MenuModel;