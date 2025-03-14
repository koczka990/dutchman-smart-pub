class StorageModel {
  constructor(database) {
    this.database = database;
    this.beverages = [];
    this.foods = [];
    this.stockKey = "productStock";
    this.storageOrderHistoryKey = "storageOrderHistory";
    this.orderHistory = this.loadOrderHistory();
  }

  // Load beverage and food data from JSON files and stock data from localStorage
  async loadStorageAndOrderHistoryData() {
    try {
      const beveragesResponse = await fetch("/data/beverages.json");
      this.beverages = await beveragesResponse.json();

      const foodsResponse = await fetch("/data/foods.json");
      this.foods = await foodsResponse.json();

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
  }

  saveStockData() {
    const stockData = {};
    this.beverages.forEach((beverage) => {
      stockData[beverage.nr] = beverage.stock;
    });
    this.foods.forEach((food) => {
      stockData[food.nr] = food.stock;
    });
    console.log("Saving stock data to Local Storage:", stockData);
    this.database.save(this.stockKey, stockData);
  }

  updateStock(productNr, amount) {
    const product =
      this.beverages.find((beverage) => beverage.nr === productNr) ||
      this.foods.find((food) => food.nr === productNr);
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
