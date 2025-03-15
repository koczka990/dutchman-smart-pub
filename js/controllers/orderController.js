import OrderModel from "../models/orderModel.js";
import OrderView from "../views/orderView.js";

class OrderController {
  constructor(app) {
    this.app = app;
    this.model = new OrderModel(app.database);
    this.view = new OrderView();
    this.init();
  }

  init() {}

  async render() {
    const orderData = this.model.getOrderData();
    await this.view.render(orderData);
  }
}

export default OrderController;
