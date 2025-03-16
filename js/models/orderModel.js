class OrderModel {
  constructor(database) {
    this.database = database;
    this.orders = [];
  }

  // Load orders from the database
  loadOrders() {
    this.orders = this.database.load("orders") || [];
    return this.orders;
    // return this.database.load("orders") || [];
  }

  getOrderData() {
    return this.loadOrders();
  }

  // Save orders to the database
  saveOrders(orders) {
    this.database.save("orders", orders);
  }

  // Create a new order
  createOrder(orderData) {
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("No items in the order");
    }

    const orders = this.loadOrders();
    const newOrder = {
      id: orders.length + 1,
      tableNumber: orderData.tableNumber,
      items: orderData.items,
      isVIP: orderData.isVIP,
      username: orderData.username,
      totalAmount: orderData.totalAmount,
      status: "pending",
      timestamp: new Date().toISOString(),
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

  // Store order details for payment processing
  storeOrderDetails(items, tableNumber) {
    // Use localStorage as a temporary storage for order details
    // This is acceptable as it's handled by the model, not the view
    localStorage.setItem("orderDetails", JSON.stringify(items));
    localStorage.setItem("selectedTable", tableNumber);
  }
}

export default OrderModel;
