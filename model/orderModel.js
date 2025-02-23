class Order {
    constructor(tableNumber, userId = null) {
        this.id = Date.now();
        this.tableNumber = tableNumber;
        this.userId = userId;  // Null for guests, set for VIPs
        this.items = []; // [{ id, name, price, quantity }]
        this.status = "pending"; // pending, completed, canceled
    }

    addItem(item, quantity = 1) {
        let existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...item, quantity });
        }
        Database.save(`order-${this.id}`, this);
    }

    removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        Database.save(`order-${this.id}`, this);
    }

    updateStatus(status) {
        this.status = status;
        Database.save(`order-${this.id}`, this);
    }

    static getOrder(id) {
        return Database.load(`order-${id}`);
    }

    static getAllOrders() {
        let orders = [];
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("order-")) {
                orders.push(Database.load(key));
            }
        });
        return orders;
    }
}
