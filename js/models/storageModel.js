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
      drinks: JSON.parse(JSON.stringify(this.drinks)),
      foods: JSON.parse(JSON.stringify(this.foods)),
      vip_drinks: JSON.parse(JSON.stringify(this.vip_drinks)),
      vip_foods: JSON.parse(JSON.stringify(this.vip_foods)),
      orderHistory: JSON.parse(JSON.stringify(this.orderHistory)),
    });

    // Restore the last undone state
    this.drinks = lastUndoneState.drinks;
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
      console.log("Loading JSON storage data...");
      // Fetch all necessary data in parallel using Promise.all
      const [
        drinksResponse,
        foodsResponse,
        vipDrinksResponse,
        vipFoodsResponse,
      ] = await Promise.all([
        fetch("/data/drinks.json"),
        fetch("/data/foods.json"),
        fetch("/data/vip_drinks.json"),
        fetch("/data/vip_foods.json"),
      ]);

      // Parse the responses into JSON
      this.drinks = await drinksResponse.json();
      this.foods = await foodsResponse.json();
      this.vip_drinks = await vipDrinksResponse.json();
      this.vip_foods = await vipFoodsResponse.json();

      console.log("JSON data loaded successfully");
      console.log("Drinks:", this.drinks.length);
      console.log("Foods:", this.foods.length);
      console.log("VIP Drinks:", this.vip_drinks.length);
      console.log("VIP Foods:", this.vip_foods.length);

      // After loading JSON data, ensure stock values are properly initialized
      this.loadLocalStorageData();
    } catch (error) {
      console.error("Error loading storage data:", error);
    }
  }

  // Load stock data and order history from localStorage
  loadLocalStorageData() {
    console.log("Loading local storage data...");
    // Load stock data from localStorage
    const stockData = this.loadLocalStorageStockData();
    console.log("Loaded stock data from localStorage:", stockData);

    // Load order history from localStorage
    this.orderHistory = this.loadLocalStorageOrderHistory();

    // If no stock data is available or if it's empty, initialize with random values
    if (!stockData || Object.keys(stockData).length === 0) {
      console.log("No stock data found, initializing with random values");
      this.initializeStockData();
    } else {
      console.log("Applying stock data from localStorage");
      this.applyStockData(stockData);
    }

    // Ensure all products have stock values
    this.ensureStockValues();
    
    // Log the stock values after initialization
    console.log("Stock values after initialization:");
    console.log("Drinks stock:", this.drinks.map(d => ({ name: d.name, stock: d.stock })));
    console.log("Foods stock:", this.foods.map(f => ({ name: f.name, stock: f.stock })));
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
    console.log("Applying stock data:", stockData);
    
    // Create a function to apply stock to a collection
    const applyStockToCollection = (collection) => {
      collection.forEach((item) => {
        if (item.nr && stockData[item.nr] !== undefined) {
          item.stock = stockData[item.nr];
          console.log(`Applied stock for ${item.name} (${item.nr}): ${item.stock}`);
        } else {
          // If no stock data found for this item, set a default value
          item.stock = 10; // Default value
          console.log(`No stock data for ${item.name} (${item.nr}), setting default: ${item.stock}`);
        }
      });
    };
    
    // Apply stock to all collections
    applyStockToCollection(this.drinks);
    applyStockToCollection(this.foods);
    applyStockToCollection(this.vip_drinks);
    applyStockToCollection(this.vip_foods);
    
    // Save the updated stock data
    this.saveStockData();
  }

  // Ensure that all products have a stock value
  ensureStockValues() {
    console.log("Ensuring all products have stock values");
    let stockUpdated = false;
    
    // Create a function to ensure stock values for a collection
    const ensureCollectionStock = (collection, collectionName) => {
      collection.forEach((item) => {
        if (item.stock === undefined) {
          item.stock = 10; // Default value for stock
          console.log(`Set default stock for ${collectionName} item ${item.name}: ${item.stock}`);
          stockUpdated = true;
        }
      });
    };
    
    // Apply to all collections
    ensureCollectionStock(this.drinks, "drinks");
    ensureCollectionStock(this.foods, "foods");
    ensureCollectionStock(this.vip_drinks, "vip_drinks");
    ensureCollectionStock(this.vip_foods, "vip_foods");

    // Save changes if stock values were updated
    if (stockUpdated) {
      console.log("Stock values were updated, saving to localStorage");
      this.saveStockData();
    } else {
      console.log("No stock values needed updating");
    }
  }

  //////////////////////////

  // Storage data methods

  // Save stock data to localStorage
  saveStockData() {
    const stockData = {};
    
    // Function to add items from a collection to stockData
    const addCollectionToStockData = (collection, collectionName) => {
      collection.forEach((item) => {
        if (item.nr) {
          stockData[item.nr] = item.stock || 0;
          console.log(`Saving stock for ${collectionName} item ${item.name} (${item.nr}): ${item.stock || 0}`);
        } else {
          console.warn(`Item ${item.name} has no product number (nr), cannot save stock`);
        }
      });
    };
    
    // Add all collections to stockData
    addCollectionToStockData(this.drinks, "drinks");
    addCollectionToStockData(this.foods, "foods");
    addCollectionToStockData(this.vip_drinks, "vip_drinks");
    addCollectionToStockData(this.vip_foods, "vip_foods");
    
    console.log("Saving stock data to Local Storage:", stockData);
    this.database.save(this.stockKey, stockData);
  }

  updateStock(productNr, amount) {
    console.log(`Updating stock for product ${productNr} by ${amount}`);
    
    // Save current state for undo functionality
    this.saveStateForUndo();
    
    // Find the product in all collections
    const product = [
      ...this.drinks,
      ...this.foods,
      ...this.vip_drinks,
      ...this.vip_foods,
    ].find((item) => item.nr === productNr);

    if (product) {
      // Ensure stock is a number before updating
      if (product.stock === undefined) {
        product.stock = 0;
      }
      
      product.stock = Math.max(0, (product.stock || 0) + amount);
      console.log(`Updated stock for ${product.name} (${productNr}): ${product.stock}`);
      this.saveStockData();
    } else {
      console.error(`Product with nr ${productNr} not found in any collection`);
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
