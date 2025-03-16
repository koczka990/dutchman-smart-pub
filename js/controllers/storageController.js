import StorageModel from "../models/storageModel.js";
import StorageView from "../views/storageView.js";

class StorageController {
  constructor(app) {
    this.app = app;
    this.model = new StorageModel(app.database);
    this.view = new StorageView(this);

    // Bind methods
    this.view.onReorder = this.handleReorder.bind(this);
    this.view.onUndo = this.handleUndo.bind(this);
    this.view.onRedo = this.handleRedo.bind(this);

    this.init();
  }

  async init() {
    // Load storage data from the database
    await this.model.loadJSONStorage();
    this.model.loadLocalStorageData();
    // this.model.ensureStockValues();
  }

  handleReorder(itemName) {
    this.model.saveStateForUndo(); // Save the current state before reordering

    const product = [
      this.model.drinks,
      this.model.foods,
      this.model.vip_drinks,
      this.model.vip_foods,
    ]
      .flatMap((arr) => arr)
      .find((item) => item.name === itemName);

    if (product) {
      product.stock = 10; // Reset stock to 10
      this.model.saveStockData(); // Save the updated stock data
      this.model.addOrder(itemName); // Save stock reorder in history

      this.app.loadView("storage"); // Re-render UI with updated stock data and order log
    }
  }

  handleUndo() {
    this.model.undo(); // Call the undo method from model
    this.app.loadView("storage"); // Re-render UI with the updated state
  }

  handleRedo() {
    this.model.redo(); // Call the redo method from model
    this.app.loadView("storage"); // Re-render UI with the updated state
  }

  async render() {
    // Always load fresh data from the database
    await this.model.loadJSONStorage();
    this.model.loadLocalStorageData();
    // this.ensureStockValues();

    // Prepare storage items for rendering
    const storageItems = [
      this.model.drinks,
      this.model.foods,
      this.model.vip_drinks,
      this.model.vip_foods,
    ]
      .flatMap((arr) => arr)
      .map((item) => ({
        name: item.name,
        stock: item.stock,
        reorderThreshold: 5,
      }));

    await this.view.render(storageItems, this.model.getOrderHistory());
  }
}

export default StorageController;
