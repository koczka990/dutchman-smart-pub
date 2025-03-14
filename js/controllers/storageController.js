import StorageModel from "../models/storageModel.js";
import StorageView from "../views/storageView.js";

class StorageController {
  constructor(app) {
    this.app = app;
    this.model = new StorageModel(app.database);
    this.view = new StorageView();

    // Bind methods
    this.view.onReorder = this.handleReorder.bind(this);
    this.view.onUndo = this.handleUndo.bind(this);
    this.view.onRedo = this.handleRedo.bind(this);

    this.init();
  }

  async init() {
    await this.model.loadStorageAndOrderHistoryData();
    this.ensureStockValues();
  }

  // Ensure that all products have a stock value
  ensureStockValues() {
    let stockUpdated = false;
    this.model.beverages.forEach((beverage) => {
      if (beverage.stock === undefined) {
        beverage.stock = 10;
        stockUpdated = true;
      }
    });
    this.model.foods.forEach((food) => {
      if (food.stock === undefined) {
        food.stock = 10;
        stockUpdated = true;
      }
    });
    this.model.vip_drinks.forEach((vip_drink) => {
      if (vip_drink.stock === undefined) {
        vip_drink.stock = 10;
        stockUpdated = true;
      }
    });
    this.model.vip_foods.forEach((vip_food) => {
      if (vip_food.stock === undefined) {
        vip_food.stock = 10;
        stockUpdated = true;
      }
    });

    // Save changes to the database
    if (stockUpdated) {
      this.model.saveStockData();
    }
  }

  handleReorder(itemName) {
    this.model.saveStateForUndo(); // Save the current state before reorderingj
    const product =
      this.model.beverages.find((b) => b.name === itemName) ||
      this.model.foods.find((f) => f.name === itemName) ||
      this.model.vip_drinks.find((c) => c.name === itemName) ||
      this.model.vip_foods.find((z) => z.name === itemName);

    if (product) {
      product.stock = 10; // Reset stock to 10
      this.model.saveStockData(); // Persist changes
      this.model.addOrder(itemName); // Save order in history
      this.model.saveOrderHistory();

      this.render(); // Re-render UI with updated order log
    }
  }

  handleUndo() {
    this.model.undo(); // Call the undo method from model
    this.render(); // Re-render UI with the updated state
  }

  handleRedo() {
    this.model.redo(); // Call the redo method from model
    this.render(); // Re-render UI with the updated state
  }

  async render() {
    // Always load fresh data from the database
    await this.model.loadStorageAndOrderHistoryData();
    this.ensureStockValues();

    const storageItems = [
      ...this.model.beverages.map((beverage) => ({
        name: beverage.name,
        stock: beverage.stock,
        reorderThreshold: 5, // can be changed later
      })),
      ...this.model.foods.map((food) => ({
        name: food.name,
        stock: food.stock,
        reorderThreshold: 5, // can be changed later
      })),
      ...this.model.vip_drinks.map((vip_drink) => ({
        name: vip_drink.name,
        stock: vip_drink.stock,
        reorderThreshold: 5, // can be changed later
      })),
      ...this.model.vip_foods.map((vip_food) => ({
        name: vip_food.name,
        stock: vip_food.stock,
        reorderThreshold: 5, // can be changed later
      })),
    ];
    await this.view.render(storageItems, this.model.getOrderHistory());
  }
}

export default StorageController;
