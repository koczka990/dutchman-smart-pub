import OrderModel from "../models/orderModel.js";
import OrderView from "../views/orderView.js";

class OrderController {
  constructor(app) {
    this.app = app;
    this.model = new OrderModel(app.database);
    this.view = new OrderView(this);
    this.init();
  }

  init() {
    // Set up the callback for completing orders
    this.view.setCompleteOrderCallback(this.completeOrder.bind(this));
  }

  async render() {
    const orderData = this.model.getOrderData();
    await this.view.render(orderData);
  }

  // Handle order completion
  completeOrder(orderId) {
    // Update the order status to "done"
    this.model.updateOrder(orderId, { status: "done" });
    
    // Get the updated order data
    const updatedOrderData = this.model.getOrderData();
    
    // Update the view's allOrders property
    this.view.allOrders = updatedOrderData;
    
    // Apply the current filter to refresh the view
    this.view.applyFilter();
  }
}

export default OrderController;
