import MenuModel from "../models/menuModel.js";
import MenuView from "../views/menuView.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import StorageModel from "../models/storageModel.js";

class MenuController {
  constructor(app) {
    this.app = app;
    this.model = new MenuModel();
    this.userModel = new UserModel();
    this.view = new MenuView(this);
    this.orderModel = new OrderModel(app.database);
    this.storageModel = new StorageModel(app.database);
    this.init();
  }

  async init() {
    await this.model.loadMenuData();
    await this.storageModel.loadStorageAndOrderHistoryData();
  }

  async render() {
    const beverages = this.model.getAllBeverages();
    const foods = this.model.getAllFoods();
    const vip_drinks = this.model.getAllVipDrinks();
    const vip_foods = this.model.getAllVipFoods();
    const userInfo = this.userModel.getCurrentUserInfo();
    await this.view.render(beverages, foods, vip_drinks, vip_foods, userInfo);
  }

  // Get current user information
  getUserInfo() {
    const userInfo = this.userModel.getCurrentUserInfo();
    console.log("Retrieved user info for order:", userInfo);
    return userInfo;
  }

  // Handle order confirmation
  async handleConfirmOrder(items, userInfo) {
    console.log("Handling order confirmation with user info:", userInfo);

    if (!items || items.length === 0) {
      alert("No items in the order. Please add some items before confirming.");
      return;
    }

    if (!userInfo) {
      console.error("No user information available");
      alert("Session error. Please log in again.");
      this.app.loadView("login");
      return;
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      // Check stock availability for all items
      for (const item of items) {
        const product =
          this.storageModel.beverages.find((b) => b.name === item.name) ||
          this.storageModel.foods.find((f) => f.name === item.name) ||
          this.storageModel.vip_drinks.find((v) => v.name === item.name) ||
          this.storageModel.vip_foods.find((v) => v.name === item.name);

        if (!product) {
          alert(`Error: Product "${item.name}" not found in inventory.`);
          return;
        }

        if (product.stock < item.quantity) {
          alert(
            `Sorry, we only have ${product.stock} units of "${item.name}" in stock.`
          );
          return;
        }
      }

      if (userInfo.isVIP) {
        // Handle VIP order
        if (parseFloat(userInfo.balance) < totalAmount) {
          alert("Insufficient balance. Please add more funds to your account.");
          return;
        }

        // Update VIP user's balance first
        await this.userModel.updateBalance(userInfo.username, -totalAmount);

        // Create order
        const order = await this.orderModel.createOrder({
          items: items,
          tableNumber: userInfo.tableNumber,
          isVIP: true,
          username: userInfo.username,
          totalAmount: totalAmount,
        });

        // Update session with new balance
        const updatedUserInfo = {
          ...userInfo,
          balance: parseFloat(userInfo.balance) - totalAmount,
        };
        this.userModel.storeUserSession(updatedUserInfo);

        alert(
          `Order confirmed! Your new balance is $${(
            parseFloat(userInfo.balance) - totalAmount
          ).toFixed(2)}`
        );
        this.render();
      } else {
        // Handle regular customer order
        const order = await this.orderModel.createOrder({
          items: items,
          tableNumber: userInfo.tableNumber,
          isVIP: false,
          totalAmount: totalAmount,
        });

        alert(
          "Order confirmed! Your order will be delivered to your table shortly."
        );
      }

      // Update stock for all items
      for (const item of items) {
        const product =
          this.storageModel.beverages.find((b) => b.name === item.name) ||
          this.storageModel.foods.find((f) => f.name === item.name) ||
          this.storageModel.vip_drinks.find((v) => v.name === item.name) ||
          this.storageModel.vip_foods.find((v) => v.name === item.name);
        if (product) {
          this.storageModel.updateStock(product.nr, -item.quantity);
        }
      }

      // Clear the order list
      this.view.clearOrderList();
    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was an error processing your order. Please try again.");
    }
  }
}

export default MenuController;
