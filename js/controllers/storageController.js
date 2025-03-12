import StorageModel from "../models/storageModel.js";
import StorageView from "../views/storageView.js";

class StorageController {
  constructor(app) {
    this.app = app;
    this.model = new StorageModel(app.database);
    this.view = new StorageView();
    this.view.onReorder = this.handleReorder.bind(this);
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

    // Save changes to the database
    if (stockUpdated) {
      this.model.saveStockData();
    }
  }

  handleReorder(itemName) {
    const product =
      this.model.beverages.find((b) => b.name === itemName) ||
      this.model.foods.find((f) => f.name === itemName);

    if (product) {
      product.stock = 10; // Reset stock to 10
      this.model.saveStockData(); // Persist changes
      this.model.addOrder(itemName); // Save order in history

      this.render(); // Re-render UI with updated order log
    }
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
    ];
    await this.view.render(storageItems, this.model.getOrderHistory());
  }
}

export default StorageController;
