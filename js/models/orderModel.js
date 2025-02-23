import Database from "./database.js";

const OrderModel = {
  // Load orders from the database
  loadOrders: function () {
    return Database.load("orders") || [];
  },

  // Save orders to the database
  saveOrders: function (orders) {
    Database.save("orders", orders);
  },

  // Create a new order
  createOrder: function (tableNumber, items, isVIP = false) {
    const orders = this.loadOrders();
    const newOrder = {
      id: orders.length + 1,
      tableNumber,
      items,
      isVIP,
      total: this.calculateTotal(items),
      status: "pending",
    };
    orders.push(newOrder);
    this.saveOrders(orders);
    return newOrder;
  },

  // Calculate the total price of an order
  calculateTotal: function (items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Update an order
  updateOrder: function (id, updatedOrder) {
    const orders = this.loadOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedOrder };
      this.saveOrders(orders);
    }
  },

  // Delete an order
  deleteOrder: function (id) {
    let orders = this.loadOrders();
    orders = orders.filter((order) => order.id !== id);
    this.saveOrders(orders);
  },
};

export default OrderModel;