import StorageModel from "../models/storageModel.js";
import StorageView from "../views/storageView.js";

class StorageController {
  constructor(app) {
    this.app = app;
    this.model = new StorageModel();
    this.view = new StorageView();
    this.init();
  }

  async init() {
    await this.model.loadStorageData();
    this.ensureStockValues();
    // this.render();
  }

  ensureStockValues() {
    let stockUpdated = false;
    this.model.beverages.forEach(beverage => {
      if (beverage.stock === undefined) {
        beverage.stock = 10;
        stockUpdated = true;
      }
    });
    this.model.foods.forEach(food => {
      if (food.stock === undefined) {
        food.stock = 10;
        stockUpdated = true;
      }
    });
    if (stockUpdated) {
      this.model.saveStockData();
    }
  }

  async render() {
    const storageItems = [
      ...this.model.beverages.map(beverage => ({
        name: beverage.name,
        stock: beverage.stock,
        reorderThreshold: 5 // can be changed later
      })),
      ...this.model.foods.map(food => ({
        name: food.name,
        stock: food.stock,
        reorderThreshold: 5 // can be changed later
      }))
    ];
    await this.view.render(storageItems);
  }
}

export default StorageController;
