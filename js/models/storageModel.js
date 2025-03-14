class StorageModel {
  constructor(database) {
    this.database = database;
    this.beverages = [];
    this.foods = [];
    this.stockKey = "productStock";
    this.storageOrderHistoryKey = "storageOrderHistory";
    this.orderHistory = this.loadOrderHistory();
    this.undoStack = []; // Keeps track of previous states for undo
    this.redoStack = []; // Keeps track of undone states for redo
  }

  // Save the current state before any stock update
  saveStateForUndo() {
    const currentState = {
      beverages: JSON.parse(JSON.stringify(this.beverages)),
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
    if (this.undoStack.length === 0) return;
    const lastState = this.undoStack.pop();
    this.redoStack.push({
      beverages: JSON.parse(JSON.stringify(this.beverages)),
      foods: JSON.parse(JSON.stringify(this.foods)),
      vip_drinks: JSON.parse(JSON.stringify(this.vip_drinks)),
      vip_foods: JSON.parse(JSON.stringify(this.vip_foods)),
      orderHistory: JSON.parse(JSON.stringify(this.orderHistory)),
    });

    this.beverages = lastState.beverages;
    this.foods = lastState.foods;
    this.vip_drinks = lastState.vip_drinks;
    this.vip_foods = lastState.vip_foods;
    this.orderHistory = lastState.orderHistory;

    this.saveStockData(); // Persist changes to localStorage
    this.saveOrderHistory(); // Persist order history data
  }

  // Redo the last undone stock update
  redo() {
    if (this.redoStack.length === 0) return;
    const lastUndoneState = this.redoStack.pop();
    this.undoStack.push({
      beverages: JSON.parse(JSON.stringify(this.beverages)),
      foods: JSON.parse(JSON.stringify(this.foods)),
      vip_drinks: JSON.parse(JSON.stringify(this.vip_drinks)),
      vip_foods: JSON.parse(JSON.stringify(this.vip_foods)),
      orderHistory: JSON.parse(JSON.stringify(this.orderHistory)),
    });

    this.beverages = lastUndoneState.beverages;
    this.foods = lastUndoneState.foods;
    this.vip_drinks = lastUndoneState.vip_drinks;
    this.vip_foods = lastUndoneState.vip_foods;
    this.orderHistory = lastUndoneState.orderHistory;

    this.saveStockData(); // Persist changes to localStorage
    this.saveOrderHistory(); // Persist order history data
  }

  // Load beverage and food data from JSON files and stock data from localStorage
  async loadStorageAndOrderHistoryData() {
    try {
      const beveragesResponse = await fetch("/data/beverages.json");
      this.beverages = await beveragesResponse.json();

      const foodsResponse = await fetch("/data/foods.json");
      this.foods = await foodsResponse.json();

      const vipDrinksResponse = await fetch("/data/vip_drinks.json");
      this.vip_drinks = await vipDrinksResponse.json();

      const vipFoodsResponse = await fetch("/data/vip_foods.json");
      this.vip_foods = await vipFoodsResponse.json();

      // Load stock data from localStorage
      const stockData = this.loadStockData();

      // If no stock data is available, initialize with random values
      if (Object.keys(stockData).length === 0) {
        this.initializeStockData();
      } else {
        this.applyStockData(stockData);
      }

      // Load order history from localStorage
      this.orderHistory = this.loadOrderHistory();
    } catch (error) {
      console.error("Error loading storage data:", error);
    }
  }

  // Load stock data from localStorage
  loadStockData() {
    return this.database.load(this.stockKey) || {};
  }

  // Load order history from localStorage
  loadOrderHistory() {
    return this.database.load(this.storageOrderHistoryKey) || [];
  }

  // Initialize stock data with random values
  initializeStockData() {
    this.beverages.forEach((beverage) => {
      beverage.stock = Math.floor(Math.random() * 11); // Random number between 0 and 10
    });
    this.foods.forEach((food) => {
      food.stock = Math.floor(Math.random() * 11); // Random number between 0 and 10
    });
    this.vip_drinks.forEach((vip_drink) => {
      vip_drink.stock = Math.floor(Math.random() * 11);
    });
    this.vip_foods.forEach((vip_food) => {
      vip_food.stock = Math.floor(Math.random() * 11);
    });
    this.saveStockData();
  }

  // Apply stock data to products
  applyStockData(stockData) {
    this.beverages.forEach((beverage) => {
      beverage.stock = stockData[beverage.nr] || 0;
    });
    this.foods.forEach((food) => {
      food.stock = stockData[food.nr] || 0;
    });
    this.vip_drinks.forEach((vip_drink) => {
      vip_drink.stock = stockData[vip_drink.nr] || 0;
    });
    this.vip_foods.forEach((vip_food) => {
      vip_food.stock = stockData[vip_food.nr] || 0;
    });
  }

  saveStockData() {
    const stockData = {};
    this.beverages.forEach((beverage) => {
      stockData[beverage.nr] = beverage.stock;
    });
    this.foods.forEach((food) => {
      stockData[food.nr] = food.stock;
    });
    this.vip_drinks.forEach((vip_drink) => {
      stockData[vip_drink.nr] = vip_drink.stock;
    });
    this.vip_foods.forEach((vip_food) => {
      stockData[vip_food.nr] = vip_food.stock;
    });
    console.log("Saving stock data to Local Storage:", stockData);
    this.database.save(this.stockKey, stockData);
  }

  updateStock(productNr, amount) {
    const product =
      this.beverages.find((beverage) => beverage.nr === productNr) ||
      this.foods.find((food) => food.nr === productNr) ||
      this.vip_drinks.find((vip_drink) => vip_drink.nr === productNr) ||
      this.vip_foods.find((vip_food) => vip_food.nr === productNr);
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

  // Add an order to history
  addOrder(itemName) {
    const orderEntry = {
      name: itemName,
      time: new Date().toLocaleTimeString(),
    };
    this.orderHistory.unshift(orderEntry); // Add new order to history
    this.saveOrderHistory(); // Persist to localStorage
  }

  getOrderHistory() {
    return this.orderHistory;
  }
}

export default StorageModel;
