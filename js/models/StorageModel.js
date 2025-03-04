import Database from "./database.js";

class StorageModel {
  constructor() {
    this.database = new Database();
    this.beverages = [];
    this.foods = [];
    this.stockKey = "productStock";
  }

  async loadStorageData() {
    try {
      const beveragesResponse = await fetch("/data/beverages.json");
      this.beverages = await beveragesResponse.json();

      const foodsResponse = await fetch("/data/foods.json");
      this.foods = await foodsResponse.json();

      // Load stock data from localStorage
      const stockData = this.database.load(this.stockKey) || {};
      console.log("Stock data loaded:", stockData);
      if (Object.keys(stockData).length === 0) {
        this.initializeStockData();
      } else {
        this.applyStockData(stockData);
      }
    } catch (error) {
      console.error("Error loading menu data:", error);
    }
  }

  initializeStockData() {
    this.beverages.forEach(beverage => {
      beverage.stock = 10;
    });
    this.foods.forEach(food => {
      food.stock = 10;
    });
    this.saveStockData();
  }

  applyStockData(stockData) {
    this.beverages.forEach(beverage => {
      beverage.stock = stockData[beverage.nr] || 0;
    });
    this.foods.forEach(food => {
      food.stock = stockData[food.nr] || 0;
    });
  }

  saveStockData() {
    const stockData = {};
    this.beverages.forEach(beverage => {
      stockData[beverage.nr] = beverage.stock;
    });
    this.foods.forEach(food => {
      stockData[food.nr] = food.stock;
    });
    console.log("Saving stock data:", stockData);
    this.database.save(this.stockKey, stockData);
  }

  updateStock(productNr, amount) {
    const product = this.beverages.find(beverage => beverage.nr === productNr) ||
                    this.foods.find(food => food.nr === productNr);
    if (product) {
      product.stock = (product.stock || 0) + amount;
      this.saveStockData();
    }
  }

  getBeverageNames() {
    if (!this.beverages) return [];
    return this.beverages.map((beverage) => beverage.name);
  }

  getFoodNames() {
    if (!this.foods) return [];
    return this.foods.map((food) => food.name);
  }

  getAllStorageNames() {
    const beverageNames = this.getBeverageNames();
    const foodNames = this.getFoodNames();
    return [...beverageNames, ...foodNames];
  }
}

export default StorageModel;
