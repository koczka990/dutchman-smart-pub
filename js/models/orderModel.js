class OrderModel {
  constructor(database) {
    this.database = database;
  }
  // Load orders from the database
  loadOrders() {
    return this.database.load("orders") || [];
  }

  // Save orders to the database
  saveOrders(orders) {
    this.database.save("orders", orders);
  }

  // Create a new order
  createOrder(identifier, items, isVIP = false) {
    if (items.length > 10) {
      throw new Error("An order can have up to 10 products.");
    }
    const orders = this.loadOrders();
    const newOrder = {
      id: orders.length + 1,
      identifier, // can be a user ID or table number
      items,
      isVIP,
      total: this.calculateTotal(items),
      status: "pending",
    };
    orders.push(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  // Calculate the total price of an order
  calculateTotal(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Update an order
  updateOrder(id, updatedOrder) {
    const orders = this.loadOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedOrder };
      this.saveOrders(orders);
    }
  }

  // Delete an order
  deleteOrder(id) {
    let orders = this.loadOrders();
    orders = orders.filter((order) => order.id !== id);
    this.saveOrders(orders);
  }

  // Filter orders by table number
  filterOrdersByTable(tableNumber) {
    const orders = this.loadOrders();
    return orders.filter((order) => order.identifier === tableNumber);
  }

  // Filter orders by user ID
  filterOrdersByUser(userId) {
    const orders = this.loadOrders();
    return orders.filter((order) => order.identifier === userId);
  }
}

export default OrderModel;
