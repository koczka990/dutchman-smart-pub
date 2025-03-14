class StorageModel {
  constructor(database) {
    this.database = database;

    // Keys for localStorage
    this.stockKey = "productStock";
    this.storageOrderHistoryKey = "storageOrderHistory";

    // Initialize storage data
    this.drinks = [];
    this.foods = [];
    this.vip_drinks = [];
    this.vip_foods = [];

    this.orderHistory = [];

    // Undo/Redo Stacks
    this.undoStack = [];
    this.redoStack = [];
  }

  // Undo/Redo functionality

  // Save the current state before any stock update
  saveStateForUndo() {
    const currentState = {
      drinks: JSON.parse(JSON.stringify(this.drinks)),
      foods: JSON.parse(JSON.stringify(this.foods)),
      vip_drinks: JSON.parse(JSON.stringify(this.vip_drinks)),
      vip_foods: JSON.parse(JSON.stringify(this.vip_foods)),
      orderHistory: JSON.parse(JSON.stringify(this.orderHistory)),
    };

    this.undoStack.push(currentState); // Save current state to undo stack
    this.redoStack = []; // Clear redo stack whenever a new action happens
  }

  // Undo the last stock update
  undo() {
    if (this.undoStack.length === 0) return; // No more actions to undo

    const lastState = this.undoStack.pop();
    this.redoStack.push({
      drinks: JSON.parse(JSON.stringify(this.drinks)),
      foods: JSON.parse(JSON.stringify(this.foods)),
      vip_drinks: JSON.parse(JSON.stringify(this.vip_drinks)),
      vip_foods: JSON.parse(JSON.stringify(this.vip_foods)),
      orderHistory: JSON.parse(JSON.stringify(this.orderHistory)),
    });

    // Restore the last state
    this.drinks = lastState.drinks;
    this.foods = lastState.foods;
    this.vip_drinks = lastState.vip_drinks;
    this.vip_foods = lastState.vip_foods;
    this.orderHistory = lastState.orderHistory;

    // Persist changes to localStorage
    this.saveStockData();
    this.saveOrderHistory();
  }

  // Redo the last undone stock update
  redo() {
    if (this.redoStack.length === 0) return; // No more actions to redo

    const lastUndoneState = this.redoStack.pop();
    this.undoStack.push({
      beverages: JSON.parse(JSON.stringify(this.drinks)),
      foods: JSON.parse(JSON.stringify(this.foods)),
      vip_drinks: JSON.parse(JSON.stringify(this.vip_drinks)),
      vip_foods: JSON.parse(JSON.stringify(this.vip_foods)),
      orderHistory: JSON.parse(JSON.stringify(this.orderHistory)),
    });

    // Restore the last undone state
    this.drinks = lastUndoneState.beverages;
    this.foods = lastUndoneState.foods;
    this.vip_drinks = lastUndoneState.vip_drinks;
    this.vip_foods = lastUndoneState.vip_foods;
    this.orderHistory = lastUndoneState.orderHistory;

    // Persist changes to localStorage
    this.saveStockData();
    this.saveOrderHistory();
  }

  //////////////////////////

  // Storage data getters

  // Load storage data from JSON files
  async loadJSONStorage() {
    try {
      // Fetch all necessary data in parallel using Promise.all
      const [
        beveragesResponse,
        foodsResponse,
        vipDrinksResponse,
        vipFoodsResponse,
      ] = await Promise.all([
        fetch("/data/beverages.json"),
        fetch("/data/foods.json"),
        fetch("/data/vip_drinks.json"),
        fetch("/data/vip_foods.json"),
      ]);

      // Parse the responses into JSON
      this.drinks = await beveragesResponse.json();
      this.foods = await foodsResponse.json();
      this.vip_drinks = await vipDrinksResponse.json();
      this.vip_foods = await vipFoodsResponse.json();
    } catch (error) {
      console.error("Error loading storage data:", error);
    }
  }

  // Load stock data and order history from localStorage
  loadLocalStorageData() {
    // Load stock data from localStorage
    const stockData = this.loadLocalStorageStockData();

    // Load order history from localStorage
    this.orderHistory = this.loadLocalStorageOrderHistory();

    // If no stock data is available, initialize with random values
    if (Object.keys(stockData).length === 0) {
      this.initializeStockData();
    } else {
      this.applyStockData(stockData);
    }
  }

  // Load stock data from localStorage
  loadLocalStorageStockData() {
    return this.database.load(this.stockKey) || {};
  }

  // Load order history from localStorage
  loadLocalStorageOrderHistory() {
    return this.database.load(this.storageOrderHistoryKey) || [];
  }

  getOrderHistory() {
    return this.orderHistory;
  }

  //////////////////////////

  // Storage data setters

  // Initialize stock data with random values
  initializeStockData() {
    const allItems = [
      ...this.drinks,
      ...this.foods,
      ...this.vip_drinks,
      ...this.vip_foods,
    ];

    allItems.forEach((item) => {
      item.stock = Math.floor(Math.random() * 11); // Random number between 0 and 10
    });

    this.saveStockData();
  }

  // Apply stock data to products
  applyStockData(stockData) {
    const allItems = [
      ...this.drinks,
      ...this.foods,
      ...this.vip_drinks,
      ...this.vip_foods,
    ];

    allItems.forEach((item) => {
      item.stock = stockData[item.nr] || 0;
    });
  }

  // Ensure that all products have a stock value
  ensureStockValues() {
    let stockUpdated = false;
    [
      ...this.drinks,
      ...this.foods,
      ...this.vip_drinks,
      ...this.vip_foods,
    ].forEach((item) => {
      if (item.stock === undefined) {
        item.stock = 10; // Default value for stock
        stockUpdated = true;
      }
    });

    // Save changes if stock values were updated
    if (stockUpdated) {
      this.saveStockData();
    }
  }

  //////////////////////////

  // Storage data methods

  // Save stock data to localStorage
  saveStockData() {
    const stockData = {};
    [this.drinks, this.foods, this.vip_drinks, this.vip_foods].forEach(
      (items) => {
        items.forEach((item) => {
          stockData[item.nr] = item.stock;
        });
      }
    );
    console.log("Saving stock data to Local Storage:", stockData);
    this.database.save(this.stockKey, stockData);
  }

  updateStock(productNr, amount) {
    const product = [
      ...this.drinks,
      ...this.foods,
      ...this.vip_drinks,
      ...this.vip_foods,
    ].find((item) => item.nr === productNr);

    if (product) {
      product.stock = (product.stock || 0) + amount;
      this.saveStockData();
    }
  }

  // Save order history to localStorage
  saveOrderHistory() {
    console.log("Saving order history to Local Storage:", this.orderHistory);
    this.database.save(this.storageOrderHistoryKey, this.orderHistory);
  }

  // Add stock reorder to history log
  addOrder(itemName) {
    const orderEntry = {
      name: itemName,
      time: new Date().toLocaleTimeString(),
    };
    this.orderHistory.unshift(orderEntry); // Add new order to history array
    this.saveOrderHistory(); // Persist to localStorage
  }
}

export default StorageModel;
